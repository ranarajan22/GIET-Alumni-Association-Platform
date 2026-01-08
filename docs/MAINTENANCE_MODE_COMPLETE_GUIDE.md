# 🔧 MAINTENANCE MODE - COMPLETE IMPLEMENTATION GUIDE

## ✅ WHAT HAS BEEN IMPLEMENTED

The maintenance mode feature is now **fully functional** with complete backend and frontend integration. This guide explains how it works and how to use it.

---

## 📋 IMPLEMENTATION OVERVIEW

### Backend Components

1. **Maintenance Model** (`backend/Models/maintenance.js`)
   - Stores maintenance status in the database
   - Tracks: `isActive`, `message`, `estimatedTime`, `lastUpdatedBy`, etc.

2. **Maintenance Controller** (`backend/Controllers/MaintenanceController.js`)
   - `getMaintenanceStatus()` - Fetch current maintenance status (admin only)
   - `updateMaintenanceStatus()` - Update maintenance mode (admin only)
   - `checkMaintenanceStatus()` - Public endpoint to check if maintenance is active

3. **Maintenance Routes** (`backend/Routes/MaintenanceRoutes.js`)
   ```
   GET  /api/maintenance/check    - Public route, no auth needed
   GET  /api/maintenance/status   - Admin only
   PUT  /api/maintenance/update   - Admin only
   ```

4. **Maintenance Middleware** (`backend/Middlewares/CheckMaintenance.js`)
   - Automatically blocks non-admin users when maintenance is active
   - Allows admins to continue working
   - Returns 503 error code with maintenance message

### Frontend Components

1. **MaintenancePage** (`frontend/src/pages/MaintenancePage.jsx`)
   - Beautiful maintenance page shown to users
   - Displays maintenance message and estimated time
   - Auto-refreshes status every 30 seconds
   - Users can manually refresh status

2. **MaintenanceWrapper** (`frontend/src/components/MaintenanceWrapper.jsx`)
   - Wraps the entire application
   - Checks maintenance status on load
   - Shows maintenance page if active (for non-admins)
   - Allows admins to access the app normally

3. **AdminSettings** (`frontend/src/components/AdminPanel/AdminSettings.jsx`)
   - Admin can toggle maintenance mode ON/OFF
   - Syncs with backend immediately
   - Fetches current status on page load

---

## 🚀 HOW IT WORKS

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   USER ACCESSES APP                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  MaintenanceWrapper checks   │
        │  status at: /api/maintenance/check
        └──────────────┬───────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
   ┌────▼────┐                   ┌────▼──────┐
   │ ACTIVE  │                   │ INACTIVE  │
   │ & NOT   │                   │ OR ADMIN  │
   │ ADMIN   │                   │           │
   └────┬────┘                   └────┬──────┘
        │                             │
   ┌────▼─────────────┐          ┌────▼──────────┐
   │ Show Maintenance │          │ Show App      │
   │ Page             │          │ Normally      │
   └──────────────────┘          └───────────────┘
```

### When Admin Toggles Maintenance Mode ON

1. Admin visits: Admin Panel → Settings → General Tab
2. Finds "Maintenance Mode" toggle
3. Clicks toggle to turn ON
4. Frontend sends `PUT /api/maintenance/update` with `isActive: true`
5. Backend updates database
6. Next time users load the page:
   - MaintenanceWrapper fetches status from `/api/maintenance/check`
   - Sees `isActive: true` and user is not admin
   - Shows MaintenancePage instead of app
7. Admins can continue working normally

### When Admin Toggles Maintenance Mode OFF

1. Same steps as above, but toggle is set to OFF
2. Users immediately see the app when they refresh
3. Existing sessions will see maintenance page until they refresh

---

## 🎮 HOW TO USE

### For Admins

#### Enable Maintenance Mode

1. Go to Admin Panel (click Profile → Admin)
2. In the sidebar, click **Settings**
3. You'll see the "General" tab by default
4. Find the section labeled **"Maintenance Mode"**
5. Click the **[OFF]** button to toggle it to **[ON]**
6. Click **"Save Settings"** button
7. Success! Message shows "Settings saved successfully!"

#### Disable Maintenance Mode

1. Repeat the same steps
2. Click the **[ON]** button to toggle it to **[OFF]**
3. Click **"Save Settings"**
4. Users will now have access to the app again

### For Users During Maintenance

1. When users try to access the app, they see the Maintenance Page
2. The page shows:
   - ⚙️ Maintenance Mode icon
   - Status message
   - Estimated time of completion
3. Users can:
   - Click "Refresh Status" button to check if maintenance is complete
   - Wait for automatic refresh (happens every 30 seconds)

---

## 📡 API ENDPOINTS

### Public Endpoint (No Auth Required)

```javascript
// Check if maintenance is active
GET /api/maintenance/check

Response:
{
  "isActive": false,
  "message": "System is under maintenance. Please try again later.",
  "estimatedTime": "2 hours"
}
```

### Admin Endpoints (Requires Auth + Admin Role)

```javascript
// Get current maintenance status
GET /api/maintenance/status
Headers: { Authorization: "Bearer <token>" }

Response:
{
  "_id": "...",
  "isActive": true,
  "message": "System is under maintenance.",
  "estimatedTime": "Unknown",
  "lastUpdatedBy": "admin@example.com",
  "updatedAt": "2024-01-15T10:30:00Z"
}

// Update maintenance status
PUT /api/maintenance/update
Headers: { Authorization: "Bearer <token>" }
Body: {
  "isActive": true,
  "message": "Database migration in progress",
  "estimatedTime": "1 hour"
}

Response:
{
  "message": "Maintenance mode enabled successfully",
  "maintenance": { ... }
}
```

---

## 🔐 Security Features

### 1. Admin Bypass
- Admins can always access the app, even during maintenance
- Maintenance mode only affects regular users

### 2. Authentication Required
- Admin endpoints require valid token
- Users must be admin to update maintenance status

### 3. Error Handling
- If backend is unreachable, app loads normally (fail-safe)
- Middleware doesn't block access if maintenance status can't be fetched

### 4. Status Code
- Returns HTTP 503 (Service Unavailable) during maintenance
- Standard convention for maintenance pages

---

## 🧪 TESTING MAINTENANCE MODE

### Test 1: Toggle Maintenance Mode

```
1. Login as admin
2. Go to Admin Panel → Settings
3. Toggle Maintenance Mode ON
4. Click Save Settings
5. Open new browser window (without authentication)
6. Visit http://localhost:5173
7. ✅ Should see Maintenance Page
8. Go back to admin settings, toggle OFF
9. Refresh the page
10. ✅ Should see normal app
```

### Test 2: Admin Can Still Access During Maintenance

```
1. Admin toggles Maintenance Mode ON
2. In same browser, navigate to Dashboard
3. ✅ Should work normally (no maintenance page)
4. Refresh the page
5. ✅ Still works for admin
```

### Test 3: Auto Status Refresh

```
1. Toggle Maintenance Mode ON
2. User sees maintenance page
3. Toggle Maintenance Mode OFF (in admin panel)
4. Wait 30 seconds
5. ✅ User's page auto-refreshes
6. ✅ Shows app instead of maintenance page
```

---

## 📝 FILES CREATED/MODIFIED

### Created:
- ✅ `backend/Middlewares/CheckMaintenance.js` - Maintenance check middleware
- ✅ `frontend/src/pages/MaintenancePage.jsx` - Maintenance display page
- ✅ `frontend/src/components/MaintenanceWrapper.jsx` - App wrapper for maintenance check

### Modified:
- ✅ `backend/server.js` - Added maintenance middleware
- ✅ `frontend/src/App.jsx` - Wrapped with MaintenanceWrapper
- ✅ `frontend/src/components/AdminPanel/AdminSettings.jsx` - Added backend sync

### Already Existed:
- ✅ `backend/Models/maintenance.js` - Database model
- ✅ `backend/Controllers/MaintenanceController.js` - API logic
- ✅ `backend/Routes/MaintenanceRoutes.js` - Route definitions

---

## ⚙️ CONFIGURATION

### Default Settings

```javascript
// Default maintenance status (when first created)
{
  isActive: false,
  message: "System is under maintenance. Please try again later.",
  estimatedTime: "Unknown"
}
```

### Custom Messages

Admin can customize the maintenance message by:
1. Future enhancement: Add message customization to Admin Settings
2. Or directly via API: `PUT /api/maintenance/update` with custom `message`

---

## 🐛 TROUBLESHOOTING

### Problem: Maintenance Mode Toggle Not Working

**Solution:**
1. Check browser console for errors
2. Verify backend server is running
3. Check network tab to see if `/api/maintenance/update` request succeeds
4. Ensure you're logged in as admin

### Problem: Users Still See App During Maintenance

**Solution:**
1. Users need to refresh page
2. Or wait 30 seconds for auto-refresh
3. Check MaintenanceWrapper is properly imported in App.jsx
4. Clear browser cache

### Problem: Admin Can't Access App During Maintenance

**Solution:**
1. Check that `userRole` is stored in localStorage
2. Role should be exactly: `admin` (case-sensitive)
3. Re-login and check role is correctly set

### Problem: Maintenance Page Shows When Shouldn't

**Solution:**
1. Go to admin settings and toggle OFF
2. Make sure "Save Settings" button is clicked
3. Check backend database for correct status
4. Restart frontend development server

---

## 📊 MONITORING

### Check Maintenance Status via Terminal

```bash
# Check if maintenance is active (public endpoint)
curl http://localhost:8083/api/maintenance/check

# Get detailed status (admin only, requires token)
curl -H "Authorization: Bearer <your-token>" \
     http://localhost:8083/api/maintenance/status
```

### Backend Logs

When maintenance is toggled, the server logs:
```
Maintenance mode ENABLED by admin@example.com
Maintenance mode DISABLED by admin@example.com
```

---

## 🚀 FUTURE ENHANCEMENTS

### Possible Improvements:

1. **Scheduled Maintenance**
   - Set specific times for maintenance
   - Auto-enable/disable at scheduled times

2. **Maintenance Reasons**
   - Show reason to users (e.g., "Database upgrade", "Server maintenance")
   - Track maintenance history

3. **Notification System**
   - Email users before maintenance
   - Show countdown timer

4. **Status Updates**
   - Admins can post updates during maintenance
   - Users see real-time status changes

5. **Analytics**
   - Track maintenance downtime
   - Log which features affected

---

## ✨ SUMMARY

**Maintenance Mode is now FULLY FUNCTIONAL with:**
- ✅ Admin toggle in settings
- ✅ Backend database persistence
- ✅ Automatic user blocking
- ✅ Admin bypass
- ✅ Beautiful maintenance page
- ✅ Auto status refresh
- ✅ API endpoints
- ✅ Security validation
- ✅ Error handling

**The system is production-ready!** 🎉
