# Vercel Serverless Deployment Guide

## ✅ Refactoring Complete

Your Express.js backend has been successfully refactored for Vercel Serverless Functions deployment!

## 📝 Changes Made

### 1. **server/index.ts** - Entry Point Refactored
- ✅ Added conditional server listening that only runs locally or in non-Vercel environments
- ✅ Added `export default app` to export the Express app for Vercel
- ✅ Server listening is skipped when `NODE_ENV === "production"` AND `VERCEL === "1"`
- ✅ The app will still work locally with `npm run dev` or `npm start`

### 2. **vercel.json** - Vercel Configuration Created
- ✅ Routes all requests (`/(.*)`") to the compiled entry point (`/dist/index.js`)
- ✅ Specifies the build target as `dist/index.js` using `@vercel/node`
- ✅ Sets `NODE_ENV=production` environment variable

## 🚀 Deployment Steps

### Step 1: Install Vercel CLI (Optional but Recommended)
```bash
npm install -g vercel
```

### Step 2: Build Your Application
```bash
npm run build
```

This will:
- Build the client (Vite)
- Build the server (ESBuild) and output to `dist/index.js`

### Step 3: Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
vercel --prod
```

#### Option B: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will automatically detect the `vercel.json` configuration

### Step 4: Configure Environment Variables in Vercel
In your Vercel project dashboard, add these environment variables:
- `DATABASE_URL` - Your Supabase connection string
- `CLIENT_URL` - Your Vercel frontend URL (if different)
- Any other secrets or API keys your app needs

## 🧪 Testing Locally

Your app still works locally! Test with:

```bash
# Development mode
npm run dev

# Production mode (simulates Vercel build)
npm run build
npm start
```

## 🔍 How It Works

### Local Development
- When running `npm run dev` or `npm start` locally:
  - `process.env.VERCEL` is undefined
  - Server binds to port 5000 (or PORT env variable)
  - Behaves like a traditional Express server

### Vercel Production
- When deployed to Vercel:
  - `process.env.VERCEL === "1"` (set by Vercel)
  - `process.env.NODE_ENV === "production"`
  - Server listening is **skipped**
  - Vercel imports the exported `app` and handles requests via serverless functions

## 📦 Key Technical Details

### Why Conditional Listening?
Vercel Serverless Functions don't need (and can't use) `app.listen()`. Vercel handles the HTTP server part and just needs your Express app exported as a handler.

### Routes Configuration
The `vercel.json` routes configuration:
```json
{
  "src": "/(.*)",
  "dest": "/dist/index.js"
}
```
This tells Vercel: "Send ALL incoming requests to the serverless function at `/dist/index.js`"

## ⚠️ Important Notes

1. **Build Before Deploy**: Always run `npm run build` before deploying
2. **Environment Variables**: Set all required env vars in Vercel dashboard
3. **CORS**: Update `CLIENT_URL` in your `.env` (and Vercel env vars) to your production frontend URL
4. **Database**: Ensure your Supabase database allows connections from Vercel's IP ranges
5. **Static Files**: The `serveStatic` function only runs in production, serving built client files

## 🔧 Troubleshooting

### Issue: "Cannot GET /"
- Check that `npm run build` completed successfully
- Verify `dist/index.js` exists
- Check Vercel build logs for errors

### Issue: Database Connection Errors
- Verify `DATABASE_URL` is set in Vercel environment variables
- Check Supabase connection pooling settings
- Consider using Supabase's connection pooler URL for serverless

### Issue: CORS Errors
- Update `CLIENT_URL` environment variable in Vercel
- Ensure your frontend domain is in the `allowedOrigins` array logic

## 📚 Additional Resources

- [Vercel Node.js Documentation](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js)
- [Express on Vercel Guide](https://vercel.com/guides/using-express-with-vercel)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)

## ✨ Next Steps

1. Test locally: `npm run build && npm start`
2. Push changes to GitHub
3. Deploy to Vercel: `vercel --prod`
4. Configure environment variables in Vercel
5. Test your deployed application!

---

**Status**: ✅ Ready for Vercel Deployment
