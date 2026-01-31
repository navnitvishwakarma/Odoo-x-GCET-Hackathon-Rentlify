# Deploying Rentlify to Vercel 🚀

This guide will walk you through deploying your full-stack application (Frontend + Backend) to Vercel using your GitHub repository.

## 1. Prerequisites
- A **GitHub Account** (You already have the repo set up).
- A **Vercel Account** (Sign up at [vercel.com](https://vercel.com) using GitHub).

## 2. Commit Deployment Configuration
I have already added the necessary `vercel.json` file to your backend folder. You just need to push this change to GitHub.

Run these commands in your terminal:
```bash
git add .
git commit -m "chore: add vercel configuration for backend"
git push origin main
```

## 3. Deploying the Backend (API)
1.  Go to your **Vercel Dashboard**.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your **Rentlify-bankend-deployment** repository (or whatever your repo is named).
4.  **Configure Project:**
    *   **Framework Preset:** Other
    *   **Root Directory:** Click "Edit" and select `backend`.
    *   **Environment Variables:** Add the variables from your `.env` file:
        *   `MONGODB_URI`: (Your MongoDB connection string)
        *   `JWT_SECRET`: (Your secret key)
        *   `JWT_ACCESS_EXPIRATION_MINUTES`: `30`
        *   `JWT_REFRESH_EXPIRATION_DAYS`: `30`
        *   `CLIENT_URL`: `https://your-frontend-project.vercel.app` (You will update this after deploying frontend, for now put `*` or localhost).
        *   `NODE_ENV`: `production`
5.  Click **Deploy**.
6.  Once deployed, copy the **Deployment URL** (e.g., `https://rentlify-backend.vercel.app`).

## 4. Deploying the Frontend (React)
1.  Go back to **Vercel Dashboard**.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import the **SAME** repository again.
4.  **Configure Project:**
    *   **Framework Preset:** Vite (Should be auto-detected)
    *   **Root Directory:** Click "Edit" and select `front-end`.
    *   **Environment Variables:**
        *   `VITE_API_URL`: Paste your **Backend Deployment URL** from step 3 (e.g., `https://rentlify-backend.vercel.app/api/v1`).
        *   **Note:** Make sure to append `/api/v1` if your backend routes are mounted there.
5.  Click **Deploy**.

## 5. Final Configuration
1.  Copy your new **Frontend Deployment URL** (e.g., `https://rentlify-frontend.vercel.app`).
2.  Go to your **Backend Project** in Vercel.
3.  Go to **Settings** -> **Environment Variables**.
4.  Update `CLIENT_URL` to your actual **Frontend URL**.
5.  **Redeploy** the backend (Go to Deployments -> Redeploy) for the CORS changes to take effect.

## ✅ Done!
Your Rentlify application is now live!
- **Frontend:** `https://rentlify-frontend.vercel.app`
- **Backend:** `https://rentlify-backend.vercel.app`
