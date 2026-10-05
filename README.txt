BhuRakshak — Intelligent Land Record Digitization & Validation System
====================================================================

DATABASE
--------
- SQLite has been completely removed from the live application.
- The server now uses MongoDB for live persistence.
- Default local connection: mongodb://127.0.0.1:27017
- Default database: bhurakshak
- For MongoDB Atlas or another server, set MONGODB_URI and MONGODB_DB before starting.

Example (Windows PowerShell):
  $env:MONGODB_URI="mongodb://127.0.0.1:27017"
  $env:MONGODB_DB="bhurakshak"
  npm install
  npm start

RESET / EMPTY DATABASE
----------------------
The old SQLite database file has been removed from this delivery package.
To completely clear the live MongoDB database before adding fresh records:
  npm run reset-db

This clears only these BhuRakshak collections:
  land_records
  documents
  admin_users
  audit_logs

There is also an optional one-time startup reset switch:
  RESET_MONGODB_ON_START=true
Do not leave this enabled in a persistent deployment because it clears data every time the server starts.

VERIFICATION + DIGITAL DOCUMENT
-------------------------------
- Records submitted for verification are stored as Pending.
- Only an authorized Officer can mark a record Verified.
- The digital verification document endpoint refuses to generate a document unless the record status is Verified.
- The generated document is populated from the verified user/land record stored in MongoDB.
- The document prominently displays the Record ID.
- The document includes the India national emblem, BhuRakshak logo and the relevant State Government branding.
- The cadastral map/naksha has been completely removed from the digital document.
- The document remains a prototype/reference document and is clearly marked as such.

PARENT DETAILS
--------------
- Father and Mother are now separate form sections.
- Father's Aadhaar number is a dedicated 12-digit field.
- Father's Aadhaar document upload is required when submitting a record for verification.
- Only the last four Aadhaar digits are retained in the land record; the full Aadhaar number is not stored.

RECORD VIEW + GIS
-----------------
- A user can search verified land records from GIS by Record ID, owner name, state, district, village, circle, Khesara, survey, plot, Khata or Khatiyan.
- Verified record viewing does not require a separate land-record password.
- Staff dashboards remain protected by officer/administrator authentication.

DIGITAL DOCUMENT QR / BRANDING
------------------------------
- The verified digital document contains the India Emblem, BhuRakshak logo, relevant State Government branding and a generated QR code.
- The QR payload is a direct absolute verification URL containing the verified Record ID.
- Scanning the QR code opens `/verify?record_id=...` and displays the verified document details in a mobile-friendly page.
- No cadastral map/naksha is embedded in the generated digital document.
- The document is still clearly marked as a prototype/reference document.

AUTHENTICATION
--------------
- Administrator login requires password + CAPTCHA + a second-factor OTP sent to the registered mobile number.
- After successful signup, the signup modal closes and the user is redirected immediately to the Login screen.
- Signup continues to require both phone OTP and email OTP verification.

RUNNING
-------
1. Install Node.js 18+.
2. Install and run MongoDB locally, or configure MONGODB_URI for MongoDB Atlas.
3. From this directory run:
     npm install
     npm start
4. Open http://localhost:3000

No SQLite native module is required anymore. This removes the previous Windows-specific sqlite3 runtime limitation.

WINDOWS / MONGODB TROUBLESHOOTING
---------------------------------
The error `MongoServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017` does NOT mean the Node code cannot use MongoDB. It means no MongoDB server is listening on the configured address/port.

Option A - local MongoDB Community Server:
1. Check the Windows service:
   Get-Service MongoDB
2. If it exists but is stopped:
   Start-Service MongoDB
3. Verify the server:
   mongosh "mongodb://127.0.0.1:27017"
4. From this project folder:
   npm install
   npm start

Option B - MongoDB Atlas:
1. Create a MongoDB Atlas cluster and database user.
2. Set the connection string before starting:
   $env:MONGODB_URI="mongodb+srv://USERNAME:PASSWORD@YOURCLUSTER.mongodb.net/?retryWrites=true&w=majority"
   $env:MONGODB_DB="bhurakshak"
   npm start

The project also supports a local `.env` file. Copy `.env.example` to `.env` and change MONGODB_URI when using Atlas. Environment variables already set in PowerShell take precedence.

If MongoDB is temporarily offline, `npm start` no longer crashes with an unhandled MongoDB promise rejection. The website starts, reports `MONGODB_UNAVAILABLE` for database-backed API calls, and automatically retries the connection when the database becomes reachable.

To clear all application data after MongoDB is running:
   npm run reset-db
This clears: land_records, documents, admin_users and audit_logs, including all administrator login records.

--- Debugging / Fixes (2026-10-04) ---
- Restored Officer-only Verify and Reject controls in the human-verification modal.
- Fixed the administrator dashboard null `dataset` crash when opening a record.
- Added live dashboard refresh for record/stat counters.
- Added Applicant Aadhaar upload alongside the Father's Aadhaar proof.
- Existing verified records are normalized to High verification confidence on staff dashboard reads; newly verified records are saved as High.
- Generated digital documents now omit empty fields, the supporting-documents section, and the previous verification notice.
- Added administrator support for resetting the record-view password for legacy records.
- Improved the public GIS record-view error when a legacy verified record has no password configured.

USER AADHAAR
------------
- User Information includes a required 12-digit Applicant Aadhaar Number field for submitted records.
- For privacy, only the last four digits are retained in MongoDB (`id_last4`); the complete Aadhaar number is not stored.
- Father's Aadhaar follows the same last-four-digit retention rule.

CURRENT DEBUG STATUS
--------------------
- Record View Password has been removed from the land-record workflow.
- Verification no longer fails because a record password is missing.
- Dashboard Total / Pending / Verified / Documents counters are backed by MongoDB and refreshed automatically.
- MongoDB query support was extended for the admin login OTP flow and QR verification route.
- `npm run reset-db` clears the BhuRakshak MongoDB collections.
