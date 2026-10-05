require("./env-loader").loadEnv();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DB || "bhurakshak";

(async () => {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    try {
        await client.connect();
        const db = client.db(dbName);
        const names = ["land_records", "documents", "admin_users", "audit_logs"];
        for (const name of names) {
            await db.collection(name).deleteMany({});
        }
        console.log(`MongoDB reset complete: ${dbName}`);
        console.log("Cleared collections: land_records, documents, admin_users, audit_logs");
    } catch (error) {
        console.error("MongoDB reset failed:", error.message);
        process.exitCode = 1;
    } finally {
        await client.close().catch(() => {});
    }
})();
