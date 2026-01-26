# 🚀 Quick Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## ✅ Pre-Deployment

- [ ] All code changes committed to Git
- [ ] Database migrations applied (`npm run db:push`)
- [ ] Environment variables configured locally
- [ ] Local build test successful (`npm run build`)
- [ ] Local production test successful (`npm start`)

## 🔧 Backend (Render)

### Setup
- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Create new Web Service

### Configuration
- [ ] **Build Command**: `npm install && npm run build`
- [ ] **Start Command**: `npm start`
- [ ] **Environment Variables**:
  - [ ] `DATABASE_URL` = Your PostgreSQL connection string
  - [ ] `NODE_ENV` = `production`
  - [ ] `PORT` = `5000`
  - [ ] `CLIENT_URL` = `https://your-app.vercel.app` (update after frontend deploy)

### Verification
- [ ] Deployment successful
- [ ] Backend URL copied (e.g., `https://your-app.onrender.com`)
- [ ] API endpoints accessible (test: `https://your-app.onrender.com/api/modules`)

## 🌐 Frontend (Vercel)

### Setup
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Framework preset detected (Vite)

### Configuration
- [ ] **Build Command**: `npm run build:client`
- [ ] **Output Directory**: `dist/public`
- [ ] **Environment Variables**:
  - [ ] `VITE_API_URL` = Your Render backend URL

### Verification
- [ ] Deployment successful
- [ ] Frontend URL copied (e.g., `https://your-app.vercel.app`)
- [ ] Application loads correctly
- [ ] API calls working (check browser console)

## 🔄 Final Steps

- [ ] Update `CLIENT_URL` in Render with Vercel URL
- [ ] Trigger backend redeploy in Render
- [ ] Test login functionality
- [ ] Test student flow
- [ ] Test admin dashboard
- [ ] Verify CORS working correctly

## 🐛 Troubleshooting

### If frontend can't connect to backend:
1. Check `VITE_API_URL` in Vercel environment variables
2. Verify backend is running on Render
3. Check browser console for errors

### If CORS errors appear:
1. Verify `CLIENT_URL` matches Vercel URL exactly
2. Check if both URLs use HTTPS
3. Review Render logs for CORS errors

### If database connection fails:
1. Verify `DATABASE_URL` is correct
2. Check Supabase/database is accessible
3. Review connection pool settings

## 📝 Environment Variables Reference

### Backend (.env) - Render
```bash
DATABASE_URL=postgresql://user:pass@host:port/db
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-app.vercel.app
```

### Frontend (client/.env) - Vercel
```bash
VITE_API_URL=https://your-app.onrender.com
```

## 🎉 Success Indicators

- [ ] Frontend loads without errors
- [ ] API requests show 200 status codes
- [ ] Students can log in
- [ ] Modules load correctly
- [ ] Progress saves successfully
- [ ] Admin dashboard displays data

## 📊 Post-Deployment Monitoring

- [ ] Set up error monitoring (optional: Sentry, LogRocket)
- [ ] Monitor Render logs for errors
- [ ] Check Vercel analytics for traffic
- [ ] Set up uptime monitoring (optional: UptimeRobot)

---

**Need Help?** Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.
