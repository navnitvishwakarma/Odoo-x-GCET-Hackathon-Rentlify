# Deployment Guide: Fixing Cart & Invoice on Vercel

The "500 Internal Server Error" you are seeing on the Vercel backend (`rentlify-bankend-dep...`) is because the live server does not yet have the latest code fixes we implemented locally.

## Step 1: Push Your Code to GitHub
You need to update the reservoir that Vercel pulls from.

1.  Open your terminal in the project root.
2.  Run the following commands:

```bash
git add .
git commit -m "Fix: Cart data integrity and Invoice generation per vendor"
git push origin main
```

*(Note: Replace `main` with `master` if that is your default branch name).*

## Step 2: Verify Vercel Deployment
1.  Go to your Vercel Dashboard.
2.  Select the **Rentlify Backend** project.
3.  Go to the **Deployments** tab.
4.  You should see a "Building" or "Ready" deployment corresponding to your recent commit. Wait for it to finish.

## Step 3: Configure Frontend Connection
To make your local frontend talk to the Vercel backend (or to deploy the frontend too):

### Option A: Running Local Frontend with Vercel Backend
Create a file named `.env` in the `front-end` folder with the following content:

```env
VITE_API_URL=https://rentlify-bankend-deployment.vercel.app/api/v1
```
*(Replace the URL above with your EXACT Vercel backend URL, ensuring it ends with `/api/v1`)*.

### Option B: Deploying Frontend to Vercel
If you are also deploying the frontend to Vercel:
1.  Go to the Frontend Project settings on Vercel.
2.  Go to **Environment Variables**.
3.  Add a new variable:
    -   **Key**: `VITE_API_URL`
    -   **Value**: `https://rentlify-bankend-deployment.vercel.app/api/v1`
4.  Redeploy the frontend.

## Step 4: Database Reset (IMPORTANT)
If you are using the **same MongoDB Atlas database** for both local and prod, the data cleaning we did locally is already applied.

If you are using a **different database** for production, you might still encounter errors with old carts. To fix this:
1.  **Solution**: The easiest way is for each user to simply "Clear Cart" or the system will auto-clear on the next error (if we implemented that fallback, but currently we rely on a manual reset). 
2.  **Manual Fix**: You might need to manually delete the 'carts' collection in your Production Database using MongoDB Compass if the error persists.

## Summary
Once you **git push**, Vercel will update, and the "Internal Server Error" on checkout will disappear because the new `Invoice` logic will be active.
