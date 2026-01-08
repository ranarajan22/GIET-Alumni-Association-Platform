require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const { initSocket } = require('./socket/socket'); // Initialize socket events
const AuthRouter = require('./Routes/AuthRouter');
const AuthAlumniRouter = require('./Routes/AuthAlumniRoutes');
const uploadRoute = require('./Routes/routeUpload');
const eventRouter = require('./Routes/eventRoutes');
const messageRoutes = require('./Routes/messageRoutes');
const userRoutes = require('./Routes/userRoutes');
const connectCloudinary = require('./utils/cloudinary');
const AdminRoutes = require('./Routes/AdminRoutes');
const jobOpeningRoutes = require('./Routes/jobOpeningRoutes'); // ✅ Added this
const mentorshipRoutes = require('./Routes/mentorshipRoutes');
const followRoutes = require('./Routes/FollowRoutes');
const alumniRoutes = require('./Routes/alumniRoutes');
const reviewRoutes = require('./Routes/reviewRoutes');
const MaintenanceRoutes = require('./Routes/MaintenanceRoutes');
const subscriberRoutes = require('./Routes/subscriberRoutes');
const contactRoutes = require('./Routes/contactRoutes');
const openSourceRoutes = require('./Routes/openSourceRoutes');
const checkMaintenanceMode = require('./Middlewares/CheckMaintenance');
require('./Models/db'); // Ensure database connection is established

// Connect to Cloudinary
connectCloudinary();

const app = express();
const server = http.createServer(app); // Create HTTP server
const path = require('path');

// Allow configuring frontend origins via env
const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176'
];

const envOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const frontendUrl = (process.env.FRONTEND_URL || '').trim();

const allowedOrigins = Array.from(
  new Set([...defaultAllowedOrigins, frontendUrl, ...envOrigins])
).filter(Boolean);

const allowAllOrigins = process.env.CORS_ALLOW_ALL === 'true';

// Initialize Socket.IO
initSocket(server, allowedOrigins, allowAllOrigins);
app.use(express.json());

// Serve uploaded assets (certificates/photos) if stored locally
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(bodyParser.json());

// CORS must come before maintenance check to handle OPTIONS preflight
app.use(cors({
  origin: (origin, callback) => {
    if (allowAllOrigins || !origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Apply maintenance check middleware globally (after CORS, before routes)
app.use(checkMaintenanceMode);

// Test route to ensure server is running
app.get('/', (req, res) => {
  res.send('Successfully connected to MongoDB Atlas || Backend At Port 8083 || Frontend At Port 5173');
});

// Define all routes
app.use('/api/auth', AuthRouter);
app.use('/api/alumni', AuthAlumniRouter);
app.use('/api/student/upload', uploadRoute);
app.use('/api/alumni/upload', uploadRoute);
app.use('/api/events', eventRouter);
app.use('/api/messages', messageRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/maintenance', MaintenanceRoutes);
app.use('/api/job-openings', jobOpeningRoutes); // ✅ Correct Job Openings route
app.use('/api/mentorships', mentorshipRoutes); // ✅ Add mentorship route
app.use('/api', followRoutes); // ✅ Add follow/unfollow routes
app.use('/api/alumni-list', alumniRoutes); // ✅ Get all verified alumni
app.use('/api/alumni-profile', alumniRoutes); // ✅ Alumni profile update endpoint
app.use('/api/reviews', reviewRoutes); // ✅ Review routes (submit, fetch, delete)
app.use('/api/subscribers', subscriberRoutes); // ✅ Newsletter subscription routes
app.use('/api/contact', contactRoutes); // ✅ Contact form routes
app.use('/api/open-source', openSourceRoutes); // ✅ Open source projects routes

// Start the server
const PORT = process.env.PORT || 8083;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
