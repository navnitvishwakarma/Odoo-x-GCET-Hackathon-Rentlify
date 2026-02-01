# Deployment Guide (Part 3): Critical Backend Fixes

I have applied critical fixes to the backend to resolve the **500 Internal Server Errors** and **Timeouts**.

## What was fixed?
1.  **Database Connection**: Optimised to prevent timeouts and connection exhaustion on Vercel.
2.  **Model Registration**: Fixed "Schema not registered" error by explicitly loading all data models (User, Vendor, Product, etc.) before the app starts.

## Deployment Steps
Please deploy these backend changes immediately.

1.  Run the following commands:
    ```bash
    git add .
    git commit -m "Fix: Optimize Vercel DB connection and register models globally"
    git push origin main
    ```

2.  **Verify Deployment**:
    *   Go to Vercel Dashboard -> Rentlify Backend.
    *   Wait for the "Ready" status.

3.  **Test Again**:
    *   Try opening `/cart` (should load now).
    *   Try viewing `/vendor/invoices` again.
