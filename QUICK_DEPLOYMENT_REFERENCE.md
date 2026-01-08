# Quick Deployment Checklist

## Before You Start
- [ ] GitHub account created
- [ ] Code pushed to main branch
- [ ] Render account (render.com)
- [ ] Vercel account (vercel.com)
- [ ] Cloudinary account (for image uploads)

---

## 🔐 Security Keys You'll Need

1. **MongoDB URI** - From MongoDB Atlas
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/Alumni-Connect?retryWrites=true&w=majority
   ```

2. **JWT Secret** - Generate here: https://passwordsgenerator.com/
   ```
   Example: xK9$mP2@vL8#qW4%tY6&jZ1!aB3$cD5%
   ```

3. **Cloudinary** - Sign up at https://cloudinary.com (free tier)
   ```
   - CLOUDINARY_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET
   ```

---

## 📝 Step-by-Step Quick Reference

### Backend Deployment (5-10 minutes)

**Step 1:** MongoDB Setup
- [ ] Create MongoDB Atlas free cluster
- [ ] Get connection string
- [ ] Add your IP to whitelist

**Step 2:** Render Deployment
- [ ] Go to render.com/dashboard
- [ ] New Web Service → Connect GitHub repo
- [ ] Set Build: `cd backend && npm install`
- [ ] Set Start: `cd backend && npm start`
- [ ] Add all env variables from PART 1
- [ ] Deploy
- [ ] Copy the URL: `https://alumni-connect-backend.onrender.com`

---

### Frontend Deployment (3-5 minutes)

**Step 1:** Vercel Deployment
- [ ] Go to vercel.com/dashboard
- [ ] Import Git Repository → Select your repo
- [ ] Framework: Vite (auto-selected)
- [ ] Add environment variables from PART 2
- [ ] Deploy
- [ ] Copy the URL: `https://your-project.vercel.app`

**Step 2:** Connect Backends
- [ ] Go back to Render
- [ ] Update FRONTEND_URL with Vercel URL
- [ ] Update CORS_ORIGINS with Vercel URL
- [ ] Save (auto-redeploy)

---

## 🧪 Testing (2-3 minutes)

- [ ] Open frontend URL in browser
- [ ] Navigate around (no 404s)
- [ ] Try to signup
- [ ] Check browser console (F12) - no red errors
- [ ] Try to login
- [ ] If errors, check Network tab for API call failures

---

## 🎯 Success Criteria

✅ Frontend loads without errors
✅ You can signup/login
✅ No CORS errors in console
✅ Render backend responding to requests
✅ Images upload working (Cloudinary)
✅ Real-time features work (Socket.IO)

---

## 📧 Email Configuration (Optional)

If you want email notifications, add these to backend environment:

```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

**How to get Gmail app password:**
1. Enable 2FA on Google Account
2. Go to myaccount.google.com → Security
3. Search "App passwords"
4. Select "Mail" and "Windows Computer"
5. Copy the 16-character password

---

## 💾 Important URLs to Save

After deployment, save these:

```
Backend URL: https://alumni-connect-backend.onrender.com
Frontend URL: https://your-project.vercel.app
MongoDB URI: (saved in Render env)
```

---

## 🔄 Redeploying

**To update code:**
```bash
git add .
git commit -m "Update: description"
git push origin main
```

- Render auto-redeploys on push (3-5 min)
- Vercel auto-redeploys on push (1-2 min)

No manual redeploy needed!

---

## 🆘 Quick Troubleshoot

| Problem | Solution |
|---------|----------|
| Backend 503 Error | Check Render logs, verify MONGO_URI |
| CORS Error | Verify FRONTEND_URL matches your Vercel domain |
| 404 on routes | Check Network tab, ensure API URL is correct |
| Images not uploading | Verify Cloudinary keys in Render env |
| Slow first request | Normal on free tier, service spins up on first request |

---

## 🎓 Learning Resources

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Express + MongoDB: https://mongoose.js.org/
- React + Vite: https://vitejs.dev/guide/

---

**Estimated Total Time: 20-30 minutes** ⏱️
