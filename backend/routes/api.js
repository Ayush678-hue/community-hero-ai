const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter (images and videos)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images and videos are supported!'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Import Controllers and Middleware
const authController = require('../controllers/authController');
const complaintController = require('../controllers/complaintController');
const analyticsController = require('../controllers/analyticsController');
const rewardsController = require('../controllers/rewardsController');
const { authenticate, authorize } = require('../middleware/auth');

// Auth Routes
router.post('/auth/signup', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/profile', authenticate, authController.getProfile);

// Complaint Routes
router.post('/complaints', authenticate, upload.single('image'), complaintController.createComplaint);
router.get('/complaints', complaintController.getComplaints);
router.get('/complaints/:id', complaintController.getComplaintById);
router.post('/complaints/:id/verify', authenticate, complaintController.verifyComplaint);
router.post('/complaints/:id/comments', authenticate, complaintController.addComment);
router.put('/complaints/:id/status', authenticate, authorize(['authority', 'admin']), upload.single('image'), complaintController.updateComplaintStatus);

// Analytics Routes
router.get('/analytics/heatmap', analyticsController.getHeatmapData);
router.get('/analytics/stats', analyticsController.getDashboardStats);

// Rewards & Leaderboard Routes
router.get('/rewards/leaderboard', rewardsController.getLeaderboard);
router.get('/rewards/notifications', authenticate, rewardsController.getNotifications);
router.post('/rewards/notifications/read', authenticate, rewardsController.markNotificationsRead);

module.exports = router;
