# BhuRakshak — Vercel Deployment Fix

## Why the old deployment failed

Vercel Functions use a read-only deployment filesystem. The old application tried to create:

`/var/task/uploads`

which caused `ENOENT` / `FUNCTION_INVOCATION_FAILED` errors.

## What this version changes

- Vercel: uploads use `multer.memoryStorage()` + **Vercel Blob (private)**.
- Local Windows development: uploads continue to use `./uploads`.
- MongoDB remains the application database.
- Officer document downloads stream private Blob files through the authenticated API.
- No uploaded document is exposed through a public `/uploads` directory on Vercel.

Vercel Private Blob supports private file storage and authenticated reads. See the official Vercel documentation for current setup details.

## Vercel steps

1. Push this version to GitHub.
2. Redeploy the Vercel project from the `main` branch.
3. In the Vercel project, open **Storage** and create/connect a **Blob** store.
4. Choose **Private** access for land-record documents.
5. Connect the Blob store to this project. Vercel provides the required Blob authentication to the deployment.
6. In **Settings → Environment Variables**, configure:

   - `MONGODB_URI` = your MongoDB Atlas connection string
   - `MONGODB_DB` = `bhurakshak`
   - `OFFICER_USER_ID` = your officer ID
   - `OFFICER_PASSWORD` = your officer password
   - `PUBLIC_BASE_URL` = your final Vercel URL, for example `https://your-project.vercel.app`

7. Redeploy after changing environment variables.
8. Test `/` first. Then test officer login and a document upload.

## Security

Never paste MongoDB credentials, officer passwords, Aadhaar documents, or Blob credentials into GitHub or chat. For real personal documents, keep the Blob store private.
