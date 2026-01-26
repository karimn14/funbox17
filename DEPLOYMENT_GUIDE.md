# 🚀 Production Deployment Guide

This guide will help you deploy your full-stack application to production using Render (Backend) and Vercel (Frontend).

## 📋 Pre-Deployment Checklist

### ✅ Code Refactoring Complete
- [x] Backend uses `process.env.PORT` with fallback to 5000
- [x] CORS configured to accept `process.env.CLIENT_URL` and localhost
- [x] Database connection uses `process.env.DATABASE_URL`
- [x] Package.json has proper `build` and `start` scripts
- [x] Frontend API client uses `import.meta.env.VITE_API_URL`
- [x] Environment variable examples created

## 🗄️ Database Setup

Your database is already configured on Supabase:
```
DATABASE_URL=postgresql://postgres:funbox17jan@db.fivmeksmoatmrhmdognr.supabase.co:5432/postgres
```

Make sure to run migrations if needed:
```bash
npm run db:push
npm run db:seed  # If you need to seed data
```

## 🎯 Backend Deployment (Render)

### 1. Push Code to GitHub
```bash
git init
git add .
git commit -m "Production ready deployment"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Create Render Account
- Go to [render.com](https://render.com)
- Sign up with your GitHub account

### 3. Create New Web Service
- Click **"New +"** → **"Web Service"**
- Connect your GitHub repository
- Configure the service:

**Basic Settings:**
- **Name**: `your-app-backend` (or any name you prefer)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: Leave empty (or `.` if needed)
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

**Environment Variables:** (Add these in Render dashboard)
```
DATABASE_URL=postgresql://postgres:funbox17jan@db.fivmeksmoatmrhmdognr.supabase.co:5432/postgres
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-app.vercel.app
```

> ⚠️ **Important**: You'll update `CLIENT_URL` after deploying the frontend

### 4. Deploy
- Click **"Create Web Service"**
- Render will automatically build and deploy
- Once deployed, copy the URL (e.g., `https://your-app-backend.onrender.com`)

## 🌐 Frontend Deployment (Vercel)

### 1. Create Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with your GitHub account

### 2. Import Project
- Click **"Add New..."** → **"Project"**
- Import your GitHub repository
- Vercel will auto-detect the project settings

### 3. Configure Project
**Framework Preset**: Vite
**Root Directory**: `./` or `client` (adjust based on your structure)

**Build & Output Settings:**
- **Build Command**: `npm run build:client` or `vite build`
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`

### 4. Environment Variables
Add this in Vercel dashboard under **Settings → Environment Variables**:
```
VITE_API_URL=https://your-app-backend.onrender.com
```

> Replace with your actual Render backend URL

### 5. Deploy
- Click **"Deploy"**
- Vercel will build and deploy your frontend
- Once deployed, copy the URL (e.g., `https://your-app.vercel.app`)

### 6. Update Backend CORS
Go back to Render dashboard and update the `CLIENT_URL` environment variable:
```
CLIENT_URL=https://your-app.vercel.app
```

Then trigger a redeploy of your backend service.

## 🔧 Project Structure

```
main2/
├── client/                 # Frontend (Vite + React)
│   ├── src/
│   │   ├── lib/
│   │   │   └── api-client.ts  # API client with env var
│   │   ├── hooks/             # Updated to use api-client
│   │   └── pages/             # Updated to use api-client
│   └── .env.example
│
├── server/                 # Backend (Express)
│   ├── index.ts           # CORS configured
│   ├── db.ts              # Database connection
│   └── routes.ts
│
├── shared/                # Shared types and routes
├── .env.example          # Backend env vars template
├── package.json          # Updated scripts
└── DEPLOYMENT_GUIDE.md   # This file
```

## 📝 Environment Variables Summary

### Backend (.env)
```bash
DATABASE_URL=postgresql://postgres:funbox17jan@db.fivmeksmoatmrhmdognr.supabase.co:5432/postgres
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-app.vercel.app
```

### Frontend (client/.env)
```bash
VITE_API_URL=https://your-app-backend.onrender.com
```

## 🧪 Testing Production Build Locally

### Test Backend
```bash
# Build
npm run build:server

# Run production server
npm start
```

### Test Frontend
```bash
# Build
npm run build:client

# Preview (if vite preview is configured)
npm run preview
```

### Test Full Stack Locally
1. Create a `client/.env.local` file:
   ```
   VITE_API_URL=http://localhost:5000
   ```

2. Run backend:
   ```bash
   npm start
   ```

3. In another terminal, run frontend:
   ```bash
   cd client
   npm run preview
   ```

## 🔍 Troubleshooting

### CORS Issues
- Verify `CLIENT_URL` in backend matches your Vercel URL exactly
- Check browser console for CORS errors
- Ensure frontend is using the correct `VITE_API_URL`

### API Connection Issues
- Check that `VITE_API_URL` is set correctly in Vercel
- Verify backend is running on Render
- Test backend API directly: `https://your-app-backend.onrender.com/api/modules`

### Database Connection Issues
- Verify `DATABASE_URL` is correct in Render
- Check Supabase dashboard for connection limits
- Review Render logs for database errors

### Build Failures
**Backend:**
- Check that all dependencies are in `dependencies` (not `devDependencies`)
- Verify TypeScript types are correct

**Frontend:**
- Ensure `VITE_API_URL` is set in build settings
- Check that all imports resolve correctly
- Review build logs in Vercel dashboard

## 📊 Monitoring

### Render Dashboard
- View logs: Click on your service → "Logs" tab
- Monitor metrics: CPU, memory usage
- Check deployment status

### Vercel Dashboard
- View deployments: Project → "Deployments"
- Check function logs if using serverless functions
- Monitor analytics and performance

## 🔄 Updating Your App

### Update Code
```bash
git add .
git commit -m "Your update message"
git push origin main
```

Both Render and Vercel will automatically:
1. Detect the push
2. Build your application
3. Deploy the new version

## 🎉 Success!

Your application should now be live:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-app-backend.onrender.com

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

## 🆘 Need Help?

If you encounter issues:
1. Check the logs in Render/Vercel dashboards
2. Verify all environment variables are set correctly
3. Test the production build locally first
4. Review the error messages carefully

Good luck with your deployment! 🚀
