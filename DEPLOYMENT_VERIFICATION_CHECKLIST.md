# Deployment Verification Checklist

## Step 1: Verify Vercel Environment Variables

**Action:** Check what you set in Vercel dashboard.

**Expected Values:**
```
VITE_API_BASE_URL = https://giet-alumni-association-platform.onrender.com
(NO /api at the end)
```

**To Check:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Look for `VITE_API_BASE_URL`
3. **Verify:** It should show `https://giet-alumni-association-platform.onrender.com` (just the origin, NO `/api`)

**If Wrong:** 
- If it shows `https://giet-alumni-association-platform.onrender.com/api` → DELETE `/api` part
- If it shows `http://localhost:8083` → Change to `https://giet-alumni-association-platform.onrender.com`
- Save and trigger a **redeploy** (Settings → Deployments → Redeploy latest)

---

## Step 2: Verify Render Backend Latest Code

**Action:** Check Render is running latest commit.

**To Check:**
1. Go to Render Dashboard → Your Backend Service
2. Scroll to "Deployments" section
3. Check the latest deployment
4. **Verify:** The commit hash should match the latest from GitHub
   - Go to GitHub → Alumni-Connect → Commits
   - Compare the hash shown in Render with the latest commit

**Current Expected Commits (should contain):**
- Commit: "Convert all hardcoded localhost:8083 URLs to centralized API_BASE_URL"
- Commit: "Standardize backend routes under /api"

**If Wrong:**
- If showing old commit → Click "Deploy latest commit" or wait for auto-redeploy
- If redeploy fails → Check Render logs (Settings → Logs tab)
  - Look for: `app.use('/api/auth', AuthRouter)` or `app.use('/api/admin', AdminRoutes)`

---

## Step 3: Verify Backend Routes Structure

**Action:** Check backend/server.js has routes under /api.

**Expected:**
```javascript
app.use('/api/auth', AuthRouter);
app.use('/api/admin', AdminRoutes);
app.use('/api/maintenance', MaintenanceRouter);
app.use('/api/contact', ContactRouter);
// etc.
```

**To Verify Locally:**
```bash
cd backend
grep -n "app.use('/api/" server.js
```

**Expected Output:**
```
app.use('/api/auth', AuthRouter);
app.use('/api/admin', AdminRoutes);
...
```

**If Wrong:**
- Routes are at `/auth`, `/admin` instead of `/api/auth`, `/api/admin`
- Check [backend/server.js](backend/server.js) and update accordingly

---

## Step 4: Check Frontend config.js Logic

**Action:** Verify the config correctly constructs API URLs.

**File:** `frontend/src/config.js`

**Expected Logic:**
```javascript
const API_ORIGIN = normalizeUrl(import.meta.env.VITE_API_BASE_URL) || normalizeUrl(fallbackApiOrigin);
// API_ORIGIN = "https://giet-alumni-association-platform.onrender.com" (NO /api)

export const API_BASE_URL = `${API_ORIGIN}/api`;
// API_BASE_URL = "https://giet-alumni-association-platform.onrender.com/api" (WITH /api)

export const SOCKET_BASE_URL = normalizeUrl(import.meta.env.VITE_SOCKET_URL) || API_ORIGIN;
// SOCKET_BASE_URL = "https://giet-alumni-association-platform.onrender.com" (NO /api)
```

**To Test Locally:**
1. Open `frontend/.env.development` (or create if doesn't exist)
2. Add:
```
VITE_API_BASE_URL=https://giet-alumni-association-platform.onrender.com
```
3. Run: `npm run dev`
4. Open browser console: `console.log(API_BASE_URL)` 
5. **Expected Output:** `https://giet-alumni-association-platform.onrender.com/api`

---

## Step 5: Test Network Requests in Browser Console

**Action:** Check actual API calls.

**To Test:**
1. Run frontend: `npm run dev` (or go to Vercel deployed URL)
2. Open Browser DevTools → Network tab
3. Trigger a request (e.g., navigate to dashboard, check maintenance status)
4. Look for API requests (Filter by "api" or "fetch/XHR")

**Expected Network URLs:**
✅ `https://giet-alumni-association-platform.onrender.com/api/maintenance/check`
✅ `https://giet-alumni-association-platform.onrender.com/api/events`

**Wrong URLs to watch for:**
❌ `https://giet-alumni-association-platform.onrender.com/api/api/maintenance/check` (double /api)
❌ `http://localhost:8083/api/api/...` (using fallback AND double /api)

---

## Step 6: Check Individual Component API Calls

**Action:** Verify a specific component uses correct paths.

**Example: Check MaintenanceWrapper.jsx**

**File:** `frontend/src/components/MaintenanceWrapper.jsx`

**Should Show:**
```javascript
import { API_BASE_URL } from '../config';

const response = await axios.get(`${API_BASE_URL}/maintenance/check`);
// NOT: `${API_BASE_URL}/api/maintenance/check` (double /api)
// NOT: `http://localhost:8083/api/maintenance/check` (hardcoded)
```

**To Verify All Components:** 
```bash
cd frontend/src
# Check no hardcoded localhost in api calls
grep -r "http://localhost:8083" --include="*.jsx" .
# Should return ZERO results (except in config.js fallback)
```

---

## Step 7: Rebuild Frontend for Vercel

**Action:** Push latest code and trigger Vercel rebuild.

```bash
# From project root
git add -A
git commit -m "Verify deployment: ensure API_BASE_URL and /api routes aligned"
git push origin main
```

**Then:**
1. Go to Vercel Dashboard
2. Watch the deployment progress
3. Once deployed, check the live URL

---

## Step 8: Test Deployed App

**Action:** Test the deployed frontend URL.

**URL:** `https://alumni-connect-frontend.vercel.app` (or your Vercel domain)

**Steps:**
1. Open the URL
2. Open DevTools → Console tab
3. Run: `const { API_BASE_URL } = require('config'); console.log(API_BASE_URL);`
4. **Should show:** `https://giet-alumni-association-platform.onrender.com/api`

**Then trigger a request:**
1. Go to Dashboard or any page that makes API call
2. DevTools → Network tab
3. Check request URLs (should NOT have double /api)

---

## Common Issues & Fixes

### Issue: `/api/api/maintenance/check` Error

**Possible Causes:**
1. ✋ VITE_API_BASE_URL in Vercel is `https://...com/api` (already has /api)
   - **Fix:** Remove `/api` from env var, set to `https://...com` only
   
2. ✋ Component code still has `${API_BASE_URL}/api/...` (hardcoded extra /api)
   - **Fix:** Change to `${API_BASE_URL}/...` (API_BASE_URL already includes /api)
   
3. ✋ Backend routes not under `/api` prefix (still at `/auth`, `/maintenance`, etc.)
   - **Fix:** Update backend/server.js to mount all routes under `/api`

### Issue: Still Using Localhost

**Possible Causes:**
1. ✋ Component has hardcoded `http://localhost:8083/api/...`
   - **Fix:** Replace with `${API_BASE_URL}/...` and import API_BASE_URL
   
2. ✋ Backend is running but frontend env var points to localhost
   - **Fix:** Update env var to Render URL

---

## Final Verification Checklist

- [ ] Vercel env var `VITE_API_BASE_URL` = `https://giet-alumni-association-platform.onrender.com` (NO /api)
- [ ] Render backend is running latest commit with `/api` route prefixes
- [ ] `frontend/src/config.js` constructs `API_BASE_URL = API_ORIGIN + '/api'`
- [ ] No hardcoded `http://localhost:8083` URLs in any component
- [ ] Network tab shows requests to `.../api/...` (single /api only)
- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on Render
- [ ] Maintenance check request succeeds with 200 status

---

## Quick Debugging Command

```bash
# List all API calls in components
grep -r "API_BASE_URL\|http://localhost" frontend/src --include="*.jsx" | grep -v "node_modules"
```

**Expected:**
- Lots of `API_BASE_URL` imports and usage ✅
- ZERO hardcoded `http://localhost` (except fallback in config.js) ✅
