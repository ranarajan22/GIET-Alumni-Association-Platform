# Package.json Complete Reference - Alumni Connect

## Overview
This document provides a comprehensive breakdown of all dependencies and scripts in the Alumni Connect project, including their purposes and usage.

---

## Backend Package.json

### Version & Metadata
- **Name**: `backend`
- **Version**: `1.0.0`
- **Main Entry**: `server.js`
- **Node Requirement**: `>=14.0.0`
- **NPM Requirement**: `>=6.0.0`

### Scripts Available

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `nodemon server.js` | Development mode with auto-reload |
| `start` | `node server.js` | Production server start |
| `seed:admin` | `node seedAdmin.js` | Create initial admin user |
| `seed:students` | `node seedStudents.js` | Seed test student users |
| `promote:admin` | `node promote-admin.js` | Promote existing user to admin |
| `list:users` | `node list-users.js` | List all users in database |
| `fix:student-role` | `node fixStudentRole.js` | Fix student role inconsistencies |
| `check:maintenance` | `node check-maintenance.js` | Check maintenance mode status |
| `maintenance:check` | `node check-maintenance.js` | Alias for checking status |
| `maintenance:disable` | `node disable-maintenance.js` | Disable maintenance mode |

### Runtime Dependencies (13 packages)

#### 1. **bcrypt** ^5.1.1
- **Purpose**: Password hashing and encryption
- **Usage**: User authentication, password security
- **Files**: `AuthController.js`, `AuthAlumniController.js`

#### 2. **body-parser** ^1.20.3
- **Purpose**: Parse incoming request bodies
- **Usage**: Middleware for JSON/form data parsing
- **Files**: `server.js`

#### 3. **cloudinary** ^1.40.0
- **Purpose**: Cloud image hosting and transformation
- **Usage**: Profile pictures, certificates, document uploads
- **Files**: `AuthController.js`, `AuthAlumniController.js`, `routeUpload.js`, `utils/cloudinary.js`
- **Features**: 
  - Image upload
  - Image transformation
  - CDN delivery

#### 4. **cors** ^2.8.5
- **Purpose**: Cross-Origin Resource Sharing
- **Usage**: Allow frontend to communicate with backend
- **Files**: `server.js`
- **Config**: Supports multiple origins

#### 5. **dotenv** ^16.4.7
- **Purpose**: Environment variable management
- **Usage**: Load .env file for configuration
- **Files**: All files using `require('dotenv').config()`
- **Variables Used**:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `CLOUDINARY_*`
  - `CORS_*`
  - `FRONTEND_URL`

#### 6. **express** ^4.21.1
- **Purpose**: Web framework
- **Usage**: Server routing, middleware, request handling
- **Files**: `server.js`, all routes

#### 7. **express-validator** ^7.2.0
- **Purpose**: Request validation and sanitization
- **Usage**: Validate user input (auth, forms)
- **Files**: `Middlewares/AuthValidation.js`, `Middlewares/AuthAlumniValidation.js`
- **Methods Used**: `validationResult()`

#### 8. **joi** ^17.13.3
- **Purpose**: Data validation library
- **Usage**: Advanced schema validation
- **Files**: `Middlewares/AuthValidation.js`, `Middlewares/AuthAlumniValidation.js`
- **Features**: 
  - Schema-based validation
  - Detailed error messages

#### 9. **jsonwebtoken** ^9.0.2
- **Purpose**: JWT token creation and verification
- **Usage**: User authentication, token management
- **Files**: `AuthController.js`, `AuthAlumniController.js`, `ProtectRoute.js`

#### 10. **mongodb** ^6.12.0
- **Purpose**: MongoDB driver
- **Usage**: Direct database operations if needed
- **Note**: Usually used via mongoose

#### 11. **mongoose** ^8.9.5
- **Purpose**: MongoDB ODM (Object Document Mapper)
- **Usage**: Database models and queries
- **Models Used**:
  - `Alumni`
  - `User`
  - `Event`
  - `JobOpening`
  - `Mentorship`
  - `Message`
  - `Conversation`
  - `Review`
  - `OpenSource`
  - `Maintenance`
  - `Subscriber`
  - `Contact`
  - `Follower`

#### 12. **multer** ^1.4.5-lts.1
- **Purpose**: File upload middleware
- **Usage**: Handle file uploads (profile pictures, documents)
- **Files**: `Middlewares/multer.js`, `Middlewares/uploadMultipleFiles.js`
- **Storage**: Local disk storage in `/uploads` directory

#### 13. **socket.io** ^4.8.1
- **Purpose**: Real-time bidirectional communication
- **Usage**: Live messaging, notifications
- **Files**: `socket/socket.js`, `server.js`
- **Features**:
  - Live chat
  - Real-time notifications
  - User presence tracking

### Development Dependencies (1 package)

#### 1. **nodemon** ^3.1.10
- **Purpose**: Automatic server restart on file changes
- **Usage**: Development mode auto-reload
- **Command**: `npm run dev`

---

## Frontend Package.json

### Version & Metadata
- **Name**: `frontend`
- **Version**: `1.0.0`
- **Type**: `module` (ES6 modules)
- **Private**: `true`

### Scripts Available

| Script | Command | Purpose |
|--------|---------|---------|
| `start` | `vite` | Start development server |
| `dev` | `vite` | Start dev server (alias) |
| `build` | `vite build` | Build for production |
| `lint` | `eslint .` | Check code quality |
| `lint:fix` | `eslint . --fix` | Fix linting issues |
| `preview` | `vite preview` | Preview production build |

### Runtime Dependencies (13 packages)

#### 1. **aos** ^2.3.4
- **Purpose**: Animate on scroll library
- **Usage**: Scroll animations for page elements
- **Files**: Multiple pages import `aos/dist/aos.css`
- **Used In**: `About.jsx`, `Contact.jsx`, `Features.jsx`, etc.

#### 2. **axios** ^1.7.7
- **Purpose**: HTTP client library
- **Usage**: API requests to backend
- **Files**: `utils/api.js`, various components
- **Features**:
  - Request/response interceptors
  - Token authentication
  - Error handling

#### 3. **lucide-react** ^0.452.0
- **Purpose**: Icon library
- **Usage**: UI icons throughout app
- **Icons Used**: Menu, CheckCircle, AlertCircle, Bell, Eye, EyeOff, Users, Clock, etc.
- **Files**: Multiple component files

#### 4. **moment** ^2.30.1
- **Purpose**: Date/time formatting
- **Usage**: Format dates for display
- **Common Usage**: Event dates, message timestamps

#### 5. **prop-types** ^15.8.1
- **Purpose**: Runtime prop validation
- **Usage**: Component prop validation
- **Files**: Components like `MentorshipList.jsx`, `NotificationContext.jsx`

#### 6. **react** ^18.3.1
- **Purpose**: React library
- **Usage**: Component framework
- **Features Used**:
  - Hooks (useState, useEffect, useContext)
  - Components
  - JSX

#### 7. **react-dom** ^18.3.1
- **Purpose**: React DOM rendering
- **Usage**: Render React to DOM
- **Files**: `main.jsx`

#### 8. **react-hot-toast** ^2.4.1
- **Purpose**: Toast notification library
- **Usage**: User feedback messages
- **Alternative**: Also uses `react-toastify`

#### 9. **react-icons** ^5.3.0
- **Purpose**: Icon library (Font Awesome, etc.)
- **Usage**: UI icons (Fa* icons)
- **Icons Used**: FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, etc.
- **Files**: Many component files

#### 10. **react-router-dom** ^6.26.2
- **Purpose**: Client-side routing
- **Usage**: Page navigation
- **Routes**:
  - Home `/`
  - Login `/login`
  - Signup (student/alumni)
  - Dashboard
  - About
  - Contact
  - 404 Not Found
- **Features**: useNavigate, useLocation, Link, Navigate

#### 11. **react-toastify** ^10.0.5
- **Purpose**: Toast notification library
- **Usage**: User notifications and alerts
- **Files**: `utils/utils.jsx` for handleSuccess/handleError
- **CSS Import**: `react-toastify/dist/ReactToastify.css` in main.jsx

#### 12. **socket.io-client** ^4.8.1
- **Purpose**: WebSocket client for real-time features
- **Usage**: Live chat, notifications
- **Files**: `context/SocketContext.jsx`, `hooks/useListenMessages.jsx`
- **Features**:
  - Real-time messaging
  - User presence
  - Notifications

#### 13. **zustand** ^5.0.1
- **Purpose**: State management
- **Usage**: Global state management
- **Note**: Not extensively used in current codebase

### Development Dependencies (11 packages)

#### 1. **@eslint/js** ^9.11.1
- **Purpose**: ESLint base rules
- **Usage**: Code linting

#### 2-3. **@types/react** & **@types/react-dom** ^18.3.x
- **Purpose**: TypeScript type definitions
- **Usage**: IDE support, type checking

#### 4. **@vitejs/plugin-react** ^4.3.2
- **Purpose**: Vite React plugin
- **Usage**: React HMR, JSX support in Vite

#### 5. **autoprefixer** ^10.4.20
- **Purpose**: PostCSS plugin for CSS prefixes
- **Usage**: Browser compatibility for CSS

#### 6. **eslint** ^9.11.1
- **Purpose**: Code quality tool
- **Usage**: Check code standards

#### 7-9. **eslint-plugin-react**, **eslint-plugin-react-hooks**, **eslint-plugin-react-refresh**
- **Purpose**: ESLint React plugins
- **Usage**: React-specific linting rules

#### 10. **globals** ^15.9.0
- **Purpose**: Global variables for linting
- **Usage**: ESLint configuration

#### 11. **postcss** ^8.4.49
- **Purpose**: CSS transformation
- **Usage**: CSS processing pipeline

#### 12. **tailwindcss** ^3.4.17
- **Purpose**: Utility-first CSS framework
- **Usage**: Styling (configured in `tailwind.config.js`)

#### 13. **vite** ^5.4.8
- **Purpose**: Build tool and dev server
- **Usage**: Project bundling and development

---

## Missing Dependencies Added

### Backend
- **multer** ^1.4.5-lts.1 (was missing, needed for file uploads)

### Frontend
- ✅ All dependencies were already present

---

## Configuration Files Reference

### Backend
- **dotenv**: `.env` file in root
- **Cloudinary**: Configured in `utils/cloudinary.js`
- **MongoDB**: Connection in `Models/db.js`
- **Socket.io**: Configuration in `socket/socket.js`
- **Multer**: Configuration in `Middlewares/multer.js`

### Frontend
- **Vite**: `vite.config.js`
- **Tailwind**: `tailwind.config.js`
- **PostCSS**: `postcss.config.js`
- **ESLint**: `eslint.config.js`

---

## Installation & Setup

### Backend Setup
```bash
cd backend
npm install
npm run dev  # Start development server
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev  # Start development server
```

---

## Version Compatibility

### Node.js
- Required: >= 14.0.0
- Recommended: >= 18.0.0

### NPM
- Required: >= 6.0.0
- Recommended: >= 9.0.0

---

## Security Notes

⚠️ **Important**: 
- Do NOT commit `.env` file with secrets
- Cloudinary credentials are hardcoded in `utils/cloudinary.js` - move to `.env`
- Use environment variables for all sensitive data
- JWT secrets should be in `.env`
- MongoDB connection strings should be in `.env`

---

## Performance Optimization Tips

1. **Frontend**:
   - Use `moment` or `date-fns` for date handling (consider `date-fns` for smaller bundle)
   - Consider code-splitting for large pages
   - Use React.lazy() for route-based code splitting

2. **Backend**:
   - Add caching for frequently accessed data
   - Consider pagination for large queries
   - Use database indexing for commonly queried fields

---

## Next Steps

1. Run `npm install` in both frontend and backend
2. Create `.env` file in backend with required variables
3. Set up MongoDB database
4. Configure Cloudinary account
5. Start development servers with `npm run dev`

---

Generated: 2024
Alumni Connect Development Team
