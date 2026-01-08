# Deployment Guide: Render + Vercel

## 📋 Prerequisites
- GitHub account with your code pushed
- Render account (render.com)
- Vercel account (vercel.com)
- MongoDB Atlas account for database

---

## 🔧 PART 1: BACKEND DEPLOYMENT ON RENDER

### Step 1: Create MongoDB Atlas Database
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign in or create account
3. Click "Create" → Select "M0 Free" cluster
4. Wait for cluster to deploy (5-10 minutes)
5. Click "Connect" → "Connect your application"
6. Copy the connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`
7. **Save this** - you'll need it for environment variables

### Step 2: Set Up Render Backend

#### 2.1: Create New Service
1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. **Connect Repository**:
   - Select "GitHub" (authorize if needed)
   - Search for "GIET-Alumni-Association-Platform" (or your repo name)
   - Click "Connect"

#### 2.2: Configure Service Settings
**Fill in these fields:**

| Field | Value |
|-------|-------|
| **Name** | alumni-connect-backend |
| **Environment** | Node |
| **Region** | (Choose closest to you) |
| **Branch** | main |
| **Build Command** | `cd backend && npm install` |
| **Start Command** | `cd backend && npm start` |
| **Instance Type** | Free |

#### 2.3: Add Environment Variables
Click "Environment" on the left sidebar:

**Add these variables** (copy from backend/.env.example):

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/Alumni-Connect?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-here-min-32-chars
JWT_EXPIRE=7d
PORT=8083
NODE_ENV=production
FRONTEND_URL=https://yourname-alumni-connect.vercel.app
CORS_ORIGINS=https://yourname-alumni-connect.vercel.app
CORS_ALLOW_ALL=false
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
MAINTENANCE_MODE=false
```

**Important Fields to Update:**
- `MONGO_URI` - Replace with your MongoDB connection string
- `JWT_SECRET` - Create a random secure key (use: https://passwordsgenerator.com/)
- `FRONTEND_URL` - Will be your Vercel URL (update after deploying frontend)
- `CLOUDINARY_*` - Get from Cloudinary (free account at cloudinary.com)

#### 2.4: Deploy
1. Click **"Create Web Service"**
2. Wait for build to complete (3-5 minutes)
3. You'll see a URL like: `https://alumni-connect-backend.onrender.com`
4. **Save this URL** - you'll need it for frontend

✅ **Backend is now live!**

---

## 🎨 PART 2: FRONTEND DEPLOYMENT ON VERCEL

### Step 1: Prepare Frontend

#### 1.1: Update API URLs
The code already handles this with `VITE_API_BASE_URL`, so no code changes needed!

#### 1.2: Commit any pending changes
```bash
cd "C:\Users\ranar\OneDrive\Desktop\Use\college\6th sem\Project\Alumni-Connect - Copy"
git add .
git commit -m "Deploy: Final configuration"
git push origin main
```

### Step 2: Deploy on Vercel

#### 2.1: Connect Repository
1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. **Authorize GitHub** (if needed)
5. Search and select **"GIET-Alumni-Association-Platform"**
6. Click **"Import"**

#### 2.2: Configure Project
**Framework**: Select **"Vite"**

Leave these as default - Vercel auto-detects!

#### 2.3: Environment Variables
Click **"Environment Variables"**

Add these variables:

```
VITE_API_BASE_URL=https://alumni-connect-backend.onrender.com/api
VITE_SOCKET_URL=https://alumni-connect-backend.onrender.com
VITE_ENV=production
VITE_APP_NAME=GIET Alumni Connect
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_ANALYTICS=false
```

**Replace** `https://alumni-connect-backend.onrender.com` with your actual Render backend URL

#### 2.4: Deploy
1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. You'll get a URL like: `https://giet-alumni-association-platform.vercel.app`
4. **This is your live app URL!**

✅ **Frontend is now live!**

---

## 🔄 PART 3: CONNECT BACKEND & FRONTEND

### Step 1: Update Backend Environment
1. Go back to Render dashboard
2. Find your backend service
3. Go to **"Environment"**
4. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://giet-alumni-association-platform.vercel.app
   ```
5. Update `CORS_ORIGINS`:
   ```
   CORS_ORIGINS=https://giet-alumni-association-platform.vercel.app
   ```
6. **Save** - It will auto-redeploy

### Step 2: Test the Connection

1. Visit your frontend URL: `https://giet-alumni-association-platform.vercel.app`
2. Try to **Sign Up** or **Log In**
3. Check browser **Console** (F12) for any errors
4. Check Render logs if there are issues

---

## 🐛 TROUBLESHOOTING

### Backend not responding?
```bash
# Check Render logs:
# 1. Go to Render dashboard
# 2. Click your service
# 3. Click "Logs" tab
# 4. Look for error messages
```

**Common issues:**
- ❌ `MongoDB connection failed` → Check MONGO_URI in environment variables
- ❌ `CORS error` → Make sure FRONTEND_URL matches your Vercel domain
- ❌ `Port already in use` → Render manages ports, should be fine

### Frontend showing 404?
- Clear browser cache (Ctrl+Shift+Delete)
- Check Network tab (F12) to see if API requests are going to correct URL
- Verify `VITE_API_BASE_URL` in Vercel environment variables

### API calls failing?
1. Open browser **Developer Tools** (F12)
2. Go to **Network** tab
3. Try an action (login/signup)
4. Check the request URL
5. Should be: `https://alumni-connect-backend.onrender.com/api/...`

---

## ✨ OPTIONAL: Custom Domain

### For Backend (Render)
1. Render → Settings → Custom Domains
2. Add your domain (e.g., `api.yourdomain.com`)
3. Add DNS record (CNAME) pointing to Render URL

### For Frontend (Vercel)
1. Vercel → Project Settings → Domains
2. Add your domain (e.g., `yourdomain.com`)
3. Add DNS record (CNAME) pointing to Vercel URL

---

## 📋 CHECKLIST

- [ ] MongoDB Atlas database created
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set on both platforms
- [ ] Backend URL updated in Vercel
- [ ] Frontend URL updated in Render
- [ ] Login/Signup tested and working
- [ ] No console errors in browser

---

## 🚀 AFTER DEPLOYMENT

### Monitor Your App
- **Render**: Dashboard shows logs and performance
- **Vercel**: Analytics tab shows traffic and errors

### Update Environment Variables
If you need to change any variable:
1. Go to service settings
2. Update environment variable
3. Service auto-redeploys

### Important Notes
- ⏱️ **First request slow?** Render spins down free tier after 15 mins of inactivity (first request takes 30 seconds)
- 🔄 **Redeploy from Render**: Just push to GitHub main branch, auto-deploys
- 🔄 **Redeploy from Vercel**: Same, just push to GitHub

---

## 📞 Need Help?

If you get stuck, check:
1. **Render Logs**: Service → Logs
2. **Vercel Logs**: Deployments tab
3. **Browser Console**: F12 → Console
4. **Network tab**: F12 → Network (check API calls)
