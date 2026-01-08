# Alumni Connect - Quick Reference Card

## 🚀 Quick Start

### Installation
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in new terminal)
cd frontend
npm install
npm run dev
```

### Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000 (or configured port)

---

## 📦 What's in the Box

### Backend (Node.js + Express)
**13 Dependencies for:**
- ✅ User authentication (bcrypt, JWT)
- ✅ Database operations (Mongoose, MongoDB)
- ✅ File uploads (Multer → Cloudinary)
- ✅ Real-time chat (Socket.io)
- ✅ Input validation (Joi, express-validator)
- ✅ CORS for frontend communication

**Key Files:**
- `server.js` - Main server
- `Models/` - Database schemas
- `Controllers/` - Business logic
- `Routes/` - API endpoints
- `Middlewares/` - Authentication & validation

### Frontend (React + Vite)
**13 Dependencies for:**
- ✅ UI building (React)
- ✅ API communication (Axios)
- ✅ Routing (React Router)
- ✅ Real-time messaging (Socket.io client)
- ✅ Styling (Tailwind CSS)
- ✅ Icons & animations (Lucide, React Icons, AOS)
- ✅ Notifications (React Toastify)

**Key Files:**
- `src/main.jsx` - Entry point
- `src/pages/` - Page components
- `src/components/` - Reusable components
- `src/utils/` - Utility functions
- `src/context/` - State management

---

## 🔧 Utility Scripts

### Backend
```bash
npm run dev                 # Start development
npm run start               # Start production
npm run seed:admin          # Create first admin user
npm run seed:students       # Add test student accounts
npm run promote:admin       # Make someone an admin
npm run list:users          # See all users
npm run fix:student-role    # Fix role issues
npm run check:maintenance   # Check maintenance mode
npm run maintenance:disable # Turn off maintenance
```

### Frontend
```bash
npm run dev       # Development server
npm run build     # Production build
npm run lint      # Check code quality
npm run lint:fix  # Auto-fix linting issues
npm run preview   # Preview production build
```

---

## 🔑 Critical Dependencies

### Backend
| Package | Why | Used For |
|---------|-----|----------|
| express | Web framework | Routes, middleware |
| mongoose | Database ODM | Data models |
| jwt | Authentication | Token auth |
| bcrypt | Password hashing | Secure passwords |
| multer | File uploads | Profile pics, docs |
| cloudinary | Image hosting | CDN storage |
| socket.io | Real-time | Live chat |

### Frontend
| Package | Why | Used For |
|---------|-----|----------|
| react | UI framework | Components |
| react-router | Navigation | Page routing |
| axios | HTTP client | API calls |
| socket.io-client | Real-time | Chat |
| tailwindcss | Styling | CSS |
| react-icons | Icons | UI icons |

---

## 📝 Important Notes

⚠️ **DO NOT COMMIT TO GIT:**
```
backend/.env          # Has secrets
node_modules/         # Too large
dist/                 # Build output
.DS_Store             # System files
```

⚠️ **SECURITY:**
- Cloudinary creds are hardcoded (move to .env)
- Use JWT_SECRET in .env
- Keep MongoDB URI in .env
- Never log sensitive data

---

## 🐛 If Something Breaks

### "Cannot find module 'multer'"
```bash
cd backend
npm install multer
```

### "Module not found" errors
```bash
# Reinstall everything
rm -rf node_modules package-lock.json
npm install
```

### Port already in use
```bash
# Change in .env or server code
# Backend: PORT=5001
# Frontend: VITE_PORT=5174
```

### Cloudinary upload fails
```
Check .env has:
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## 📊 Architecture Overview

```
Alumni Connect
├── Frontend (React/Vite)
│   ├── Pages (Home, Login, Dashboard)
│   ├── Components (Navbar, Cards, Forms)
│   └── Contexts (Auth, Socket, Notification)
│
├── Backend (Express/Node)
│   ├── Models (Alumni, User, Event, etc.)
│   ├── Controllers (Business logic)
│   ├── Routes (API endpoints)
│   └── Middlewares (Auth, Upload, Validation)
│
└── Database (MongoDB)
    └── Collections (Users, Events, Messages, etc.)
```

---

## 🔗 Key Endpoints

### Auth
- `POST /auth/signup` - Register student
- `POST /auth/login` - Login student
- `POST /auth/alumni/signup` - Register alumni
- `POST /auth/alumni/login` - Login alumni

### Users
- `GET /users/sidebar` - Get chat contacts
- `GET /users/all-students` - List all students
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile

### Events
- `GET /events` - Get all events
- `POST /events` - Create event
- `GET /events/:id` - Get event details
- `DELETE /events/:id` - Delete event

### Messages
- `GET /messages/:userId` - Get chat history
- `POST /messages/:userId/send` - Send message
- `GET /conversations` - Get chat contacts

---

## 🚦 Development Workflow

1. **Start Backend**
   ```bash
   cd backend && npm run dev
   ```

2. **Start Frontend** (new terminal)
   ```bash
   cd frontend && npm run dev
   ```

3. **Make Changes**
   - Both have hot reload
   - Changes save automatically

4. **Test**
   - Frontend: http://localhost:5173
   - API: http://localhost:5000

5. **Build for Production**
   ```bash
   cd frontend && npm run build
   cd backend # already production-ready
   ```

---

## 📚 Documentation Files

- `PACKAGE_JSON_COMPLETE_REFERENCE.md` - Detailed dependency info
- `PACKAGE_JSON_BEFORE_AFTER.md` - What changed and why
- `PACKAGE_JSON_UPDATE_SUMMARY.md` - Quick summary

---

## ✅ Checklist Before Deploying

- [ ] .env file created with all secrets
- [ ] MongoDB connection tested
- [ ] Cloudinary account configured
- [ ] Frontend builds without errors
- [ ] Backend starts without errors
- [ ] Login works (both roles)
- [ ] File uploads work
- [ ] Real-time chat works
- [ ] All API endpoints respond
- [ ] No console errors

---

## 💡 Pro Tips

1. **Use npm scripts** - They're documented now!
2. **Check .env first** - 90% of issues are here
3. **Clear cache** - `npm cache clean --force`
4. **Fresh install** - Delete node_modules and reinstall
5. **Check logs** - Both frontend and backend show errors

---

## 🎯 Next Steps

1. **Install**: `npm install` in both directories
2. **Configure**: Create .env with all variables
3. **Test**: Run `npm run dev` in both
4. **Build**: When ready, `npm run build`
5. **Deploy**: Use your hosting platform

---

## 📞 Support

If you need help:
1. Check the console for error messages
2. Review the detailed documentation files
3. Verify .env configuration
4. Ensure all dependencies are installed
5. Check if ports are available

---

**Last Updated**: 2024
**Status**: ✅ Complete & Ready to Use
