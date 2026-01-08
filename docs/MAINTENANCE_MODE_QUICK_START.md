# ⚡ MAINTENANCE MODE - QUICK START

## 🎯 One-Minute Setup

The maintenance mode is already fully implemented and working! Here's how to use it:

---

## 🎮 Enable/Disable Maintenance

### Step 1: Login as Admin
```
1. Go to http://localhost:5173
2. Click Profile (top right)
3. Click "Admin Dashboard"
```

### Step 2: Open Settings
```
1. In the Admin Panel sidebar
2. Click "Settings" (gear icon)
3. Select "General" tab
```

### Step 3: Toggle Maintenance Mode
```
1. Find "Maintenance Mode" section
2. Click the toggle button
   - [OFF] = App is running normally
   - [ON] = App shows maintenance page to users
3. Click "Save Settings" button
4. See confirmation message
```

---

## 👥 What Users See

### When Maintenance Mode is OFF ✅
- Users see the normal Alumni Connect app
- Everything works as expected

### When Maintenance Mode is ON 🔧
- Users see a maintenance page with:
  - ⚙️ Maintenance icon
  - Status message
  - Estimated completion time
  - "Refresh Status" button
  - Auto-refreshes every 30 seconds

---

## 🔒 Admin Access

**Important:** Admins can ALWAYS access the app, even during maintenance!

This allows admins to:
- Fix issues that caused the downtime
- Test fixes before bringing app back online
- Monitor the situation

---

## 📱 Real-World Example

### Scenario: Database Server Goes Down

```
1:00 PM - Issue detected
├─ Admin logs in (still works because admin bypass)
├─ Admin goes to Settings → General
├─ Toggles Maintenance Mode ON
├─ Saves settings
└─ Message: "Settings saved successfully!"

Users see: "System is under maintenance. Please try again later."

1:30 PM - Issue fixed
├─ Admin toggles Maintenance Mode OFF
├─ Saves settings
└─ Message: "Settings saved successfully!"

Users see: App loads normally on refresh ✅
```

---

## 🔗 Technical Details

### API Endpoints

| Endpoint | Method | Auth? | Purpose |
|----------|--------|-------|---------|
| `/api/maintenance/check` | GET | No | Check if maintenance active |
| `/api/maintenance/status` | GET | Yes (Admin) | Get detailed status |
| `/api/maintenance/update` | PUT | Yes (Admin) | Update maintenance status |

### Key Files

- **Frontend:** `frontend/src/components/AdminPanel/AdminSettings.jsx`
- **Backend:** `backend/Routes/MaintenanceRoutes.js`
- **Controller:** `backend/Controllers/MaintenanceController.js`
- **Middleware:** `backend/Middlewares/CheckMaintenance.js`
- **Model:** `backend/Models/maintenance.js`

---

## ✨ Features

✅ **One-Click Toggle** - Simple ON/OFF button
✅ **Database Persistence** - Status saved in MongoDB
✅ **Admin Bypass** - Admins can work during maintenance
✅ **Beautiful UI** - Professional maintenance page
✅ **Auto Refresh** - Users see updates automatically
✅ **Status Messages** - Customizable messages for users
✅ **Estimated Time** - Show expected completion time
✅ **Error Handling** - Falls back if backend unavailable

---

## 🚀 Testing

### Quick Test

```
1. Toggle maintenance ON
2. Open new browser/incognito window
3. Go to http://localhost:5173
4. ✅ Should see maintenance page
5. Toggle maintenance OFF
6. Refresh page
7. ✅ Should see normal app
```

### Advanced Test

```
1. Toggle maintenance ON
2. Stay logged in as admin
3. Navigate to Dashboard
4. ✅ Works normally (admin bypass)
5. Open same app in new incognito window
6. ✅ Shows maintenance page
```

---

## ❓ FAQ

**Q: Can I customize the maintenance message?**
A: Currently shows default message. Future: Admin can edit message.

**Q: How long can maintenance be active?**
A: As long as needed. No time limit.

**Q: Do users lose data?**
A: No. Data is preserved. Only access is blocked.

**Q: Can multiple admins toggle it?**
A: Yes. Last admin to toggle it wins. (Last update is final state)

**Q: Does it work with multiple servers?**
A: Yes. Status is in MongoDB, so all servers see same status.

---

## 🎓 Use Cases

1. **Emergency Fixes** - Quickly block users while fixing critical bugs
2. **Database Maintenance** - Migrate data without user interference
3. **Server Upgrades** - Upgrade hardware/software gracefully
4. **Backups** - Run critical backups without conflicts
5. **Security Patches** - Apply security updates safely
6. **Performance Optimization** - Optimize database/code with users blocked

---

## 📊 Status Check

### From Browser Console

```javascript
// Check if maintenance is active
fetch('http://localhost:8083/api/maintenance/check')
  .then(r => r.json())
  .then(data => console.log(data.isActive ? '🔧 MAINTENANCE' : '✅ NORMAL'))
```

### From Terminal

```bash
curl http://localhost:8083/api/maintenance/check
# Returns: { "isActive": true/false, "message": "...", ... }
```

---

## 🎉 You're Ready!

Everything is set up and working. Just:
1. Toggle ON when you need maintenance
2. Toggle OFF when done
3. Done! ✨

**No additional setup needed!**
