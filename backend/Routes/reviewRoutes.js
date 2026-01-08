const express = require('express');
const router = express.Router();
const {
    submitReview,
    getAlumniReviews,
    deleteReview,
    getAlumniStats
} = require('../Controllers/ReviewController');
const protectRoute = require('../Middlewares/ProtectRoute');

// Submit or update a review for an alumni (protected)
router.post('/:alumniId/review', protectRoute, submitReview);

// Get all reviews for an alumni
router.get('/:alumniId/reviews', getAlumniReviews);

// Delete a specific review (protected)
router.delete('/:reviewId', protectRoute, deleteReview);

// Get alumni stats including average rating and follower count
router.get('/:alumniId/stats', getAlumniStats);

module.exports = router;
