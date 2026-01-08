# QUICK FIX ACTIONS - Do These In Order

## CRITICAL CHECK #1: Vercel Environment Variable

**MOST LIKELY PROBLEM:** Your VITE_API_BASE_URL might still have `/api` at the end.

### ✅ Action 1: Fix Vercel Env Var (5 min)
1. Go to: https://vercel.com/dashboard/alumni-connect (or your project)
2. Click "Settings" → "Environment Variables"
3. Find `VITE_API_BASE_URL`
4. **It should be:**
   ```
   https://giet-alumni-association-platform.onrender.com
   ```
   **NOT:**
   ```
   https://giet-alumni-association-platform.onrender.com/api
   ```

5. If it's wrong, edit it and **SAVE**
6. Go to "Deployments" tab
7. Click "Redeploy" on the latest deployment

**Timeline:** Wait 2-3 minutes for redeploy to finish.

---

## CRITICAL CHECK #2: Backend Is Running Latest Code

### ✅ Action 2: Verify Render Backend (5 min)
1. Go to: https://render.com/dashboard
2. Find your backend service
3. Scroll to "Deployments"
4. **Check the commit hash** - it should say something like:
   ```
   Convert all hardcoded localhost:8083 URLs to centralized API_BASE_URL
   ```
   
5. **If it's showing an OLD commit** → Render didn't pick up your latest push
   - Scroll up and click "Deploy latest commit"
   - Wait 3-5 minutes for redeploy

---

## CRITICAL CHECK #3: Test Locally First

### ✅ Action 3: Run Frontend Locally (10 min)

```bash
# Terminal 1: Start backend
cd backend
npm start
# Should show: "Server running on port 8083"

# Terminal 2: Start frontend
cd frontend
npm run dev
# Should show: "➜  Local: http://localhost:5173"
```

### ✅ Action 4: Check Frontend Config Values

1. In browser, go to: `http://localhost:5173`
2. Open DevTools: Press `F12`
3. Go to "Console" tab
4. Paste this:
```javascript
import { API_BASE_URL, API_ORIGIN } from './src/config.js';
console.log('API_ORIGIN:', API_ORIGIN);
console.log('API_BASE_URL:', API_BASE_URL);
```

**Expected Output:**
```
API_ORIGIN: http://localhost:8083
API_BASE_URL: http://localhost:8083/api
```

**If You See:**
- `http://localhost:8083/api/api` → Someone is adding extra `/api` manually
- `undefined` → Config.js didn't load properly

---

## CRITICAL CHECK #4: Check Network Requests

### ✅ Action 5: Monitor Network Tab

1. Keep DevTools open (F12 → Network tab)
2. Navigate to any page that makes API calls (Dashboard, Events, etc.)
3. **Look at the requests**:

**CORRECT URLs (should see these):**
```
✅ http://localhost:8083/api/maintenance/check
✅ http://localhost:8083/api/events
✅ http://localhost:8083/api/admin/metrics
```

**WRONG URLs (if you see these, there's a problem):**
```
❌ http://localhost:8083/api/api/maintenance/check (DOUBLE /api)
❌ http://localhost:8083/api/api/events
```

---

## If You See `/api/api` Error:

### 🔧 Quick Diagnose:

**Question 1:** Is it in the maintenance check only?
- **Yes** → Issue in MaintenanceWrapper.jsx
- **No** → Issue in config.js or multiple components

**Question 2:** Run in Browser Console:
```javascript
fetch('/api/maintenance/check')
  .then(r => r.json())
  .then(d => console.log('Success:', d))
  .catch(e => console.error('Error:', e.message));
```

**If it works** → Problem is in frontend config construction
**If it fails with 404** → Backend route missing `/api` prefix

---

## COMPLETE FIX CHECKLIST

### Pre-Deploy (Local Testing):
- [ ] Terminal 1: `cd backend && npm start` (running on 8083)
- [ ] Terminal 2: `cd frontend && npm run dev` (running on 5173)
- [ ] Browser Console shows correct `API_BASE_URL` value
- [ ] Network tab shows single `/api` in URLs (not double)
- [ ] Maintenance check request succeeds (200 status)

### Before Pushing:
- [ ] All components use `import { API_BASE_URL }` and `${API_BASE_URL}/endpoint`
- [ ] No hardcoded `http://localhost:8083` URLs (except config.js fallback)
- [ ] Backend has all routes under `/api` prefix
- [ ] No `/api/api` pattern anywhere in requests

### On Vercel:
- [ ] Env var `VITE_API_BASE_URL=https://giet-alumni-association-platform.onrender.com` (NO /api at end)
- [ ] Redeploy triggered after env var change
- [ ] Wait 2-3 min for deploy to finish

### On Render:
- [ ] Backend service is running
- [ ] Latest commit is deployed
- [ ] Logs show no errors (click "Logs" tab)

### Final Test:
- [ ] Visit deployed Vercel URL
- [ ] Open DevTools → Network tab
- [ ] Make API request and verify single `/api` in URL
- [ ] Check console for any errors

---

## COMMAND TO FIND ALL `/api` References

Run from project root:
```bash
# Find all /api references in frontend components
grep -r "/api/" frontend/src/components --include="*.jsx" | grep -v node_modules | head -20
```

You should see things like:
```
${API_BASE_URL}/maintenance/check
${API_BASE_URL}/events
```

**NOT:**
```
${API_BASE_URL}/api/...   ❌ WRONG - double /api
http://localhost:8083/api/...  ❌ WRONG - hardcoded
```

---

## If Still Broken After All This:

1. **Check Render logs:**
   - Render Dashboard → Your Service → Logs
   - Look for startup errors or route registration issues

2. **Check Vercel build logs:**
   - Vercel Dashboard → Your Project → Deployments → Latest → Build logs
   - Look for build errors or missing env vars

3. **Run this locally:**
   ```bash
   cd frontend
   VITE_API_BASE_URL=https://giet-alumni-association-platform.onrender.com npm run build
   ```
   Then check if build completes without errors

4. **Test backend directly:**
   ```bash
   curl https://giet-alumni-association-platform.onrender.com/api/maintenance/check
   ```
   Should return JSON response (not 404)

---

## SUMMARY OF 3 THINGS THAT MUST BE TRUE:

1. **Vercel env:** `VITE_API_BASE_URL=https://giet-alumni-association-platform.onrender.com` (without /api)
2. **Frontend config:** `API_BASE_URL = API_ORIGIN + '/api'` (appends /api)
3. **Network requests:** Show single `/api` in URLs

If all 3 are true, it will work. If any one is wrong, you'll get `/api/api` error.
