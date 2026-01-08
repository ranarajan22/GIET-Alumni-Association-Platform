const express = require('express');
const router = express.Router();
const protectRoute = require('../Middlewares/ProtectRoute');
const { followUser, followAlumni, unfollowUser, unfollowAlumni } = require('../Controllers/FollowController');


// POST /users/:userId/follow/user/:followeeId
router.post('/users/:userId/follow/user/:followeeId', followUser);

// POST /users/:userId/follow/alumni/:alumniId
router.post('/users/:userId/follow/alumni/:alumniId', followAlumni);
  
// DELETE /users/:userId/unfollow/user/:followeeId
router.delete('/users/:userId/unfollow/user/:followeeId', unfollowUser);
  
// DELETE /users/:userId/unfollow/alumni/:alumniId
router.delete('/users/:userId/unfollow/alumni/:alumniId', unfollowAlumni);

// Simplified follow/unfollow endpoints for alumni (protected routes)
router.post('/follow/:alumniId', protectRoute, followAlumni);
router.post('/follow/unfollow/:alumniId', protectRoute, unfollowAlumni);

module.exports = router;