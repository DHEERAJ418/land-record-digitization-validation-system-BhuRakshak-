require("./env-loader").loadEnv();
const { MongoClient } = require("mongodb");
const crypto = require("crypto");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const MONGODB_DB = process.env.MONGODB_DB || "bhurakshak";

let client = null;
let database = null;
let databaseInitError = null;
let connectPromise = null;
let nextRetryAt = 0;
const retryDelayMs = Number(process.env.MONGODB_RETRY_DELAY_MS || 3000);

function now() {
    return new Date().toISOString();
}

function id() {
    return crypto.randomUUID();
}

function cleanMongo(doc) {
    if (!doc) return doc;
    const out = { ...doc };
    if (out._id !== undefined) delete out._id;
    return out;
}

function collection(name) {
    if (!database) throw new Error("MongoDB is not connected.");
    return database.collection(name);
}

async function initializeConnectedDatabase() {
    client = new MongoClient(MONGODB_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 5000),
    });

    await client.connect();
    const db = client.db(MONGODB_DB);

    // Verify that the server is actually usable before declaring the connection ready.
    await db.command({ ping: 1 });
    database = db;

    await Promise.all([
        collection("land_records").createIndex({ record_id: 1 }, { unique: true }),
        collection("land_records").createIndex({ user_id: 1 }, { unique: true }),
        collection("land_records").createIndex({ status: 1, state: 1, district: 1, village: 1, khasra_number: 1 }),
        collection("documents").createIndex({ record_id: 1, created_at: 1 }),
        collection("admin_users").createIndex({ user_id: 1 }, { unique: true }),
        collection("admin_users").createIndex({ contact: 1 }),
        collection("admin_users").createIndex({ email: 1 }),
        collection("audit_logs").createIndex({ created_at: -1 }),
        collection("audit_logs").createIndex({ record_id: 1 }),
    ]);

    const oneTimeResetMarker = require("path").join(__dirname, ".reset-db-once");
    if (require("fs").existsSync(oneTimeResetMarker) || String(process.env.RESET_MONGODB_ON_START || "false").toLowerCase() === "true") {
        await clearDatabase();
        if (require("fs").existsSync(oneTimeResetMarker)) require("fs").unlinkSync(oneTimeResetMarker);
        console.warn("MongoDB reset requested: land_records, documents, admin_users and audit_logs were cleared.");
    }

    databaseInitError = null;
    nextRetryAt = 0;
    return database;
}

async function ensureDatabase() {
    if (database) return database;

    if (connectPromise) return connectPromise;

    if (Date.now() < nextRetryAt && databaseInitError) {
        throw databaseInitError;
    }

    connectPromise = initializeConnectedDatabase()
        .catch(async error => {
            databaseInitError = error;
            database = null;
            nextRetryAt = Date.now() + retryDelayMs;
            if (client) {
                await client.close().catch(() => {});
                client = null;
            }
            throw error;
        })
        .finally(() => {
            connectPromise = null;
        });

    return connectPromise;
}

function getDatabaseStatus() {
    return {
        connected: Boolean(database),
        database: MONGODB_DB,
        uri: MONGODB_URI.replace(/:\/\/([^:@/]+):([^@/]+)@/, "://***:***@"),
        error: databaseInitError ? String(databaseInitError.message || databaseInitError) : null,
    };
}

// This promise is intentionally non-rejecting. The old implementation created a
// rejected promise during module load, which caused `npm start` to terminate when
// MongoDB was not running. The server can now start and will reconnect automatically
// when MongoDB becomes available.
const databaseReady = ensureDatabase().catch(error => {
    console.warn(`MongoDB is not available at startup: ${error.message}`);
    return null;
});

function normalize(sql) {
    return String(sql || "").replace(/\s+/g, " ").trim();
}

function valueFromLiteralOrParam(token, params, cursor) {
    const t = token.trim();
    if (t === "?") return { value: params[cursor.index++], cursor };
    if (/^current_timestamp$/i.test(t)) return { value: now(), cursor };
    if (/^null$/i.test(t)) return { value: null, cursor };
    if ((t.startsWith("'") && t.endsWith("'")) || (t.startsWith('"') && t.endsWith('"'))) {
        return { value: t.slice(1, -1).replace(/''/g, "'").replace(/\\"/g, '"'), cursor };
    }
    if (/^\d+(?:\.\d+)?$/.test(t)) return { value: Number(t), cursor };
    return { value: t, cursor };
}

async function run(sql, params = []) {
    await ensureDatabase();
    const q = normalize(sql);

    if (/^INSERT INTO audit_logs/i.test(q)) {
        const [record_id, actor_role, actor_id, action, details] = params;
        const doc = { id: id(), record_id: record_id || null, actor_role: actor_role || "system", actor_id: actor_id || "system", action, details: details || "", created_at: now() };
        await collection("audit_logs").insertOne(doc);
        return { changes: 1, lastID: doc.id, insertedId: doc.id };
    }

    if (/^INSERT INTO documents/i.test(q)) {
        const [record_id, document_type, original_name, stored_name, mime_type, size] = params;
        const doc = { id: id(), record_id, document_type, original_name, stored_name, mime_type: mime_type || "", size: Number(size || 0), created_at: now() };
        await collection("documents").insertOne(doc);
        return { changes: 1, lastID: doc.id, insertedId: doc.id };
    }

    if (/^INSERT INTO admin_users/i.test(q)) {
        const [full_name, user_id, contact, email, password_hash] = params;
        const doc = {
            id: id(), full_name, user_id, contact, email: email || "", password_hash,
            phone_verified: 1, email_verified: 1, created_at: now()
        };
        await collection("admin_users").insertOne(doc);
        return { changes: 1, lastID: doc.id, insertedId: doc.id };
    }

    if (/^INSERT INTO land_records/i.test(q)) {
        const match = q.match(/^INSERT INTO land_records \((.+)\) VALUES \((.+)\)$/i);
        if (!match) throw new Error("Unsupported land_records INSERT statement.");
        const fields = match[1].split(",").map(s => s.trim());
        const valueTokens = match[2].split(",").map(s => s.trim());
        const cursor = { index: 0 };
        const doc = { id: id() };
        fields.forEach((field, i) => {
            doc[field] = valueFromLiteralOrParam(valueTokens[i], params, cursor).value;
        });
        const timestamp = now();
        doc.created_at = doc.created_at || timestamp;
        doc.updated_at = doc.updated_at || timestamp;
        await collection("land_records").insertOne(doc);
        return { changes: 1, lastID: doc.id, insertedId: doc.id };
    }


    if (/^UPDATE admin_users SET /i.test(q)) {
        const match = q.match(/^UPDATE admin_users SET (.+) WHERE id = \?$/i);
        if (!match) throw new Error("Unsupported admin_users UPDATE statement.");
        const assignments = match[1].split(",").map(s => s.trim());
        const update = {};
        const cursor = { index: 0 };
        for (const assignment of assignments) {
            const eq = assignment.indexOf("=");
            if (eq < 0) continue;
            const field = assignment.slice(0, eq).trim();
            const token = assignment.slice(eq + 1).trim();
            update[field] = valueFromLiteralOrParam(token, params, cursor).value;
        }
        const userId = params[params.length - 1];
        const result = await collection("admin_users").updateOne({ id: userId }, { $set: update });
        return { changes: result.modifiedCount || result.matchedCount, lastID: userId };
    }

    if (/^UPDATE land_records SET /i.test(q)) {
        const match = q.match(/^UPDATE land_records SET (.+) WHERE id = \?$/i);
        if (!match) throw new Error("Unsupported land_records UPDATE statement.");
        const assignments = match[1].split(",").map(s => s.trim());
        const update = {};
        const cursor = { index: 0 };
        for (const assignment of assignments) {
            const eq = assignment.indexOf("=");
            if (eq < 0) continue;
            const field = assignment.slice(0, eq).trim();
            const token = assignment.slice(eq + 1).trim();
            update[field] = valueFromLiteralOrParam(token, params, cursor).value;
        }
        const recordId = params[params.length - 1];
        if (Object.prototype.hasOwnProperty.call(update, "updated_at") && update.updated_at === "CURRENT_TIMESTAMP") update.updated_at = now();
        const result = await collection("land_records").updateOne({ id: recordId }, { $set: update });
        return { changes: result.modifiedCount || result.matchedCount, lastID: recordId };
    }

    if (/^PRAGMA /i.test(q) || /^CREATE TABLE /i.test(q) || /^ALTER TABLE /i.test(q) || q === "SELECT 1") {
        return { changes: 0, lastID: null };
    }

    throw new Error(`Unsupported database write query: ${q.slice(0, 180)}`);
}

async function get(sql, params = []) {
    await ensureDatabase();
    const q = normalize(sql);

    if (/^SELECT COUNT\(\*\) AS count FROM land_records$/i.test(q) || /^SELECT COUNT\(\*\) count FROM land_records$/i.test(q)) {
        return { count: await collection("land_records").countDocuments({}) };
    }
    const statusCount = q.match(/^SELECT COUNT\(\*\) (?:AS )?count FROM land_records WHERE status = '([^']+)'$/i);
    if (statusCount) return { count: await collection("land_records").countDocuments({ status: statusCount[1] }) };
    if (/^SELECT COUNT\(\*\) count FROM documents$/i.test(q)) return { count: await collection("documents").countDocuments({}) };
    if (/^SELECT id FROM admin_users WHERE user_id = \?$/i.test(q)) {
        const doc = await collection("admin_users").findOne({ user_id: params[0] }, { projection: { id: 1 } });
        return doc ? cleanMongo(doc) : undefined;
    }
    if (/^SELECT \* FROM admin_users WHERE user_id = \?$/i.test(q)) {
        return cleanMongo(await collection("admin_users").findOne({ user_id: params[0] }));
    }
    if (/^SELECT \* FROM land_records WHERE record_id = \?$/i.test(q)) {
        return cleanMongo(await collection("land_records").findOne({ record_id: params[0] }));
    }
    if (/^SELECT id FROM admin_users WHERE contact = \?$/i.test(q)) {
        const doc = await collection("admin_users").findOne({ contact: params[0] }, { projection: { id: 1 } });
        return doc ? cleanMongo(doc) : undefined;
    }
    if (/^SELECT id FROM admin_users WHERE lower\(email\) = lower\(\?\)$/i.test(q)) {
        const email = String(params[0] || "").toLowerCase();
        const doc = await collection("admin_users").findOne({ email: { $regex: `^${escapeRegex(email)}$`, $options: "i" } }, { projection: { id: 1 } });
        return doc ? cleanMongo(doc) : undefined;
    }
    if (/^SELECT \* FROM admin_users WHERE contact = \? OR lower\(email\) = lower\(\?\) OR user_id = \? LIMIT 1$/i.test(q)) {
        const [contact, email, userId] = params;
        const doc = await collection("admin_users").findOne({ $or: [
            { contact },
            { email: { $regex: `^${escapeRegex(String(email || ""))}$`, $options: "i" } },
            { user_id: userId }
        ] });
        return cleanMongo(doc);
    }
    const byId = q.match(/^SELECT \* FROM (land_records|documents) WHERE id = \?$/i);
    if (byId) {
        const doc = await collection(byId[1]).findOne({ id: params[0] });
        return cleanMongo(doc);
    }
    throw new Error(`Unsupported database read query: ${q.slice(0, 220)}`);
}

async function all(sql, params = []) {
    await ensureDatabase();
    const q = normalize(sql);
    const records = collection("land_records");

    if (/^SELECT \* FROM land_records ORDER BY id DESC$/i.test(q) || /^SELECT \* FROM land_records ORDER BY updated_at DESC$/i.test(q)) {
        const rows = await records.find({}).sort({ updated_at: -1, created_at: -1 }).toArray();
        return rows.map(cleanMongo);
    }

    if (/^SELECT id, document_type, original_name, stored_name, mime_type, size, created_at FROM documents WHERE record_id = \? ORDER BY id ASC$/i.test(q)) {
        const rows = await collection("documents").find({ record_id: params[0] }).sort({ created_at: 1 }).toArray();
        return rows.map(cleanMongo);
    }

    if (/^SELECT \* FROM land_records WHERE status = 'Verified'/i.test(q) && q.includes("LIMIT 5")) {
        const [state, district, village, villageLike, khasra, survey, plot, normalizedKhasra, circle, circleExact, circleLike] = params;
        const norm = value => String(value || "").trim().toLowerCase();
        const normK = value => norm(value).replace(/[\/-]/g, "");
        const docs = await records.find({ status: "Verified" }).toArray();
        const filtered = docs.filter(r => {
            if (norm(r.state) !== norm(state) || norm(r.district) !== norm(district)) return false;
            const rv = norm(r.village);
            if (!(rv === norm(village) || rv.includes(norm(villageLike)))) return false;
            const hk = norm(r.khasra_number), hs = norm(r.survey_number), hp = norm(r.plot_number);
            if (!(hk === norm(khasra) || hs === norm(survey) || hp === norm(plot) || normK(hk) === normK(normalizedKhasra))) return false;
            if (norm(circle) && !(norm(r.circle) === norm(circleExact) || norm(r.circle).includes(norm(circleLike)))) return false;
            return true;
        });
        filtered.sort((a, b) => {
            const av = norm(a.village) === norm(village) ? 0 : 1;
            const bv = norm(b.village) === norm(village) ? 0 : 1;
            if (av !== bv) return av - bv;
            const ac = !norm(circle) || norm(a.circle) === norm(circleExact) ? 0 : 1;
            const bc = !norm(circle) || norm(b.circle) === norm(circleExact) ? 0 : 1;
            if (ac !== bc) return ac - bc;
            return String(b.updated_at || b.created_at).localeCompare(String(a.updated_at || a.created_at));
        });
        return filtered.slice(0, 5).map(cleanMongo);
    }

    if (/^SELECT a\.\*, r\.record_id FROM audit_logs a LEFT JOIN land_records r ON r\.id=a\.record_id ORDER BY a\.id DESC LIMIT \?$/i.test(q)) {
        const limit = Math.min(Math.max(Number(params[0]) || 50, 1), 200);
        const logs = await collection("audit_logs").find({}).sort({ created_at: -1 }).limit(limit).toArray();
        const ids = [...new Set(logs.map(x => x.record_id).filter(Boolean))];
        const related = ids.length ? await records.find({ id: { $in: ids } }, { projection: { id: 1, record_id: 1 } }).toArray() : [];
        const map = new Map(related.map(r => [r.id, r.record_id]));
        return logs.map(log => ({ ...cleanMongo(log), record_id: map.get(log.record_id) || log.record_id || null }));
    }

    if (/^SELECT status,COUNT\(\*\) count FROM land_records GROUP BY status$/i.test(q)) {
        const rows = await records.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }, { $project: { _id: 0, status: "$_id", count: 1 } }, { $sort: { status: 1 } }]).toArray();
        return rows;
    }
    if (/^SELECT confidence,COUNT\(\*\) count FROM land_records GROUP BY confidence$/i.test(q)) {
        const rows = await records.aggregate([{ $group: { _id: "$confidence", count: { $sum: 1 } } }, { $project: { _id: 0, confidence: "$_id", count: 1 } }, { $sort: { confidence: 1 } }]).toArray();
        return rows;
    }
    if (/^SELECT substr\(created_at,1,10\) day,COUNT\(\*\) count FROM land_records GROUP BY substr\(created_at,1,10\) ORDER BY day DESC LIMIT 14$/i.test(q)) {
        const rows = await records.aggregate([
            { $project: { day: { $substrBytes: ["$created_at", 0, 10] } } },
            { $group: { _id: "$day", count: { $sum: 1 } } },
            { $project: { _id: 0, day: "$_id", count: 1 } },
            { $sort: { day: -1 } },
            { $limit: 14 }
        ]).toArray();
        return rows;
    }
    if (/^SELECT lower\(trim\(state\)\) state, lower\(trim\(district\)\) district, lower\(trim\(village\)\) village, lower\(trim\(khasra_number\)\) khasra_number, COUNT\(\*\) count FROM land_records/i.test(q)) {
        const rows = await records.aggregate([
            { $match: { state: { $exists: true, $ne: "" }, district: { $exists: true, $ne: "" }, village: { $exists: true, $ne: "" }, khasra_number: { $exists: true, $ne: "" } } },
            { $project: { state: { $toLower: { $trim: { input: "$state" } } }, district: { $toLower: { $trim: { input: "$district" } } }, village: { $toLower: { $trim: { input: "$village" } } }, khasra_number: { $toLower: { $trim: { input: "$khasra_number" } } } } },
            { $group: { _id: { state: "$state", district: "$district", village: "$village", khasra_number: "$khasra_number" }, count: { $sum: 1 } } },
            { $match: { count: { $gt: 1 } } },
            { $project: { _id: 0, state: "$_id.state", district: "$_id.district", village: "$_id.village", khasra_number: "$_id.khasra_number", count: 1 } }
        ]).toArray();
        return rows;
    }

    throw new Error(`Unsupported database list query: ${q.slice(0, 240)}`);
}

function escapeRegex(value) {
    return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function clearDatabase() {
    await Promise.all([
        collection("land_records").deleteMany({}),
        collection("documents").deleteMany({}),
        collection("admin_users").deleteMany({}),
        collection("audit_logs").deleteMany({}),
    ]);
}

module.exports = {
    MONGODB_URI,
    MONGODB_DB,
    databaseReady,
    ensureDatabase,
    getDatabaseStatus,
    get databaseInitError() { return databaseInitError; },
    run,
    get,
    all,
    clearDatabase,
    close: async () => { if (client) await client.close().catch(() => {}); client = null; database = null; },
};
