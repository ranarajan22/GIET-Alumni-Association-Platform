# 🧪 QUICK TESTING GUIDE - ADMIN PANEL

## 🚀 START HERE

### 1. **Access Admin Dashboard**
```
URL: http://localhost:5174/admin
Login Required: Yes
```

**Admin Credentials:**
- Email: `00adm001.admin@giet.edu`
- Password: `Admin@123`

---

## ✅ QUICK TEST CHECKLIST

### Test 1: Dashboard Overview
- [ ] Load `/admin` page
- [ ] See 4 stat cards:
  - [ ] Total Students: **8**
  - [ ] Total Alumni: **6**
  - [ ] Pending Verifications: **0**
  - [ ] Total Postings: **12** (8 events + 2 jobs + 2 mentorships)
- [ ] Activity feed showing recent items
- [ ] Data auto-refreshes every 30 seconds (check browser console)

### Test 2: Click Stats Cards
- [ ] Click **"Total Students"** → Shows 8 students list ✓
- [ ] Click **"Total Alumni"** → Shows 6 alumni with verification badges ✓

### Test 3: Sidebar Navigation
**Click each menu item:**

- [ ] **Overview** 
  - Shows dashboard with all stats
  - Displays activity feed
  
- [ ] **Students**
  - Shows list of 8 students
  - Each student has: name, email, role badge
  
- [ ] **Alumni**
  - Shows pending alumni (currently 0)
  - When alumni pending: Shows with verify button
  
- [ ] **Analytics**
  - Shows top performers
  - System health status
  - Bar charts and statistics
  
- [ ] **Settings**
  - Shows General, Security, Notifications, Logs tabs
  - Maintenance Mode toggle visible

### Test 4: Maintenance Mode Toggle
**Location:** Settings → General Tab

```
Steps:
1. Click Settings in sidebar
2. Click "General" tab
3. Find "Maintenance Mode" section
4. Click toggle button
5. Should change from OFF (gray) → ON (red)
6. Click "Save Settings"
7. Success message appears ✓
```

**Expected UI Change:**
- OFF state: Gray button with text "OFF"
- ON state: Red button with text "ON"
- Tooltip: "Temporarily disable user access"

### Test 5: Settings Tabs
**Location:** Settings Page

- [ ] **General Tab**
  - [ ] App name input field
  - [ ] Max upload size input
  - [ ] Maintenance Mode toggle ✓
  - [ ] Auto-Verify Alumni toggle
  - [ ] Save Settings button
  
- [ ] **Security Tab**
  - [ ] Password/security options
  - [ ] Session management
  
- [ ] **Notifications Tab**
  - [ ] Email notifications toggle
  - [ ] Alert preferences
  
- [ ] **Logs Tab**
  - [ ] Admin activity history
  - [ ] Shows action, admin name, time, status

### Test 6: Admin Settings Features

**App Name Configuration:**
- [ ] Enter new app name
- [ ] Click Save Settings
- [ ] Confirmation message appears
- [ ] Name updates

**Max Upload Size:**
- [ ] Change value (e.g., from 10 to 20)
- [ ] Click Save Settings
- [ ] Value persists

**Toggle Features:**
- [ ] Maintenance Mode toggle works
- [ ] Auto-Verify Alumni toggle works
- [ ] Email Notifications toggle works
- [ ] All show ON/OFF states correctly

### Test 7: Real-Time Updates
**Expected Behavior:**

- [ ] Auto-refresh every 30 seconds
- [ ] Check browser console (F12 → Console tab)
- [ ] Should see logs like:
  ```
  Fetching metrics from: http://localhost:8083/admin/metrics
  Metrics response: {totalStudents: 8, totalAlumni: 6, ...}
  Fetching activity from: http://localhost:8083/admin/activity
  Activity response: {feed: [...]}
  ```

### Test 8: Mobile Responsiveness
**On Mobile Screen (< 768px):**
- [ ] Hamburger menu appears (top-left)
- [ ] Click hamburger → sidebar slides in
- [ ] Click menu item → sidebar closes
- [ ] All buttons and toggles work on touch
- [ ] Text readable on small screens

### Test 9: Error Handling
**Test Network Error:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Click "Offline" to simulate no internet
4. Refresh page
5. Should show error messages instead of crashing

### Test 10: Logout
**Location:** Settings → Account Tab (or bottom of sidebar)

- [ ] Click Logout button
- [ ] Redirected to home page
- [ ] Token removed from localStorage
- [ ] Cannot access `/admin` without re-login

---

## 📊 EXPECTED DATA

```
✓ Total Students: 8
  ├─ All with role='student'
  └─ Synced from Users collection

✓ Total Alumni: 6
  ├─ All verified (verified: true)
  └─ Synced from Alumni collection

✓ Events: 8
✓ Job Openings: 2
✓ Mentorships: 2
```

---

## 🔌 API ENDPOINTS TESTING

### Test with Postman/curl:

```bash
# 1. Get Auth Token (from login response)
TOKEN="your_jwt_token_here"

# 2. Test Metrics Endpoint
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:8083/admin/metrics

# Expected Response:
{
  "totalStudents": 8,
  "totalAlumni": 6,
  "verifiedAlumni": 6,
  "pendingVerifications": 0,
  "eventsCount": 8,
  "jobsCount": 2,
  "mentorshipsCount": 2
}

# 3. Test Students Endpoint
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:8083/admin/students

# Expected Response:
{
  "students": [...]  // Array of 8 students
}

# 4. Test Alumni Endpoint
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:8083/admin/alumni

# Expected Response:
{
  "alumni": [...]  // Array of 6 alumni
}

# 5. Test Activity Endpoint
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:8083/admin/activity

# Expected Response:
{
  "feed": [...]  // Array of recent activities
}
```

---

## 🎨 UI ELEMENTS TO VERIFY

### Color Scheme:
- ✓ Dark theme (slate-950 background)
- ✓ Cyan/blue accents for active states
- ✓ Card gradient effects
- ✓ Hover animations on buttons

### Icons:
- ✓ Dashboard icon on Overview
- ✓ Users icon on Students
- ✓ Graduation cap on Alumni
- ✓ Chart icon on Analytics
- ✓ Settings icon on Settings

### Responsive Grid:
- ✓ Desktop: 4 columns for stat cards
- ✓ Tablet: 2 columns
- ✓ Mobile: 1 column

---

## 🐛 TROUBLESHOOTING

### Stats showing 0?
```
✓ Fixed: All users with role='student' properly synced
✓ Total Students now shows: 8
```

### Maintenance Mode not toggling?
```
Steps to fix:
1. Clear localStorage: localStorage.clear()
2. Refresh page: Ctrl+R
3. Login again
4. Try toggle again
```

### No data displaying?
```
Check:
1. Browser console (F12) for errors
2. Network tab to see API responses
3. Ensure token is valid (not expired)
4. Verify admin role in database
```

### API returning 401 (Unauthorized)?
```
Reasons:
- Token expired → Login again
- Missing Authorization header → Check localStorage
- Wrong admin credentials → Use: 00adm001.admin@giet.edu
```

---

## ✨ SUCCESS CRITERIA

**All tests pass when:**
- ✅ All 5 sidebar menu items work
- ✅ Stats cards display correct numbers
- ✅ Clicking cards navigates to list views
- ✅ Maintenance Mode toggle works
- ✅ Settings save with confirmation
- ✅ Auto-refresh updates data every 30s
- ✅ No console errors
- ✅ Responsive design on all screen sizes
- ✅ All API endpoints return data

---

**Test Date:** December 25, 2025
**Tester Role:** Admin
**Expected Result:** ✅ ALL PASS
