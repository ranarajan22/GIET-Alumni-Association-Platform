const Review = require('../Models/review');
const Alumni = require('../Models/alumni');
const User = require('../Models/users');

const submitReview = async (req, res) => {
    try {
        const { alumniId } = req.params;
        const { rating, reviewText } = req.body;
        const studentId = req.user?._id;

        if (!studentId) {
            return res.status(401).json({ error: 'Student must be logged in to submit a review' });
        }

        if (!rating || !reviewText) {
            return res.status(400).json({ error: 'Rating and review text are required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // Check if alumni exists
        const alumni = await Alumni.findById(alumniId);
        if (!alumni) {
            return res.status(404).json({ error: 'Alumni not found' });
        }

        // Check if student already reviewed this alumni
        let review = await Review.findOne({ student: studentId, alumni: alumniId });

        if (review) {
            // Update existing review
            review.rating = rating;
            review.reviewText = reviewText;
            await review.save();
            return res.status(200).json({ message: 'Review updated successfully', review });
        }

        // Create new review
        const student = await User.findById(studentId);
        review = new Review({
            rating,
            reviewText,
            student: studentId,
            alumni: alumniId,
            studentName: student?.fullName || 'Anonymous',
            studentPhoto: student?.profilePhoto || null
        });

        await review.save();
        res.status(201).json({ message: 'Review submitted successfully', review });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ error: 'Failed to submit review' });
    }
};

const getAlumniReviews = async (req, res) => {
    try {
        const { alumniId } = req.params;

        // Check if alumni exists
        const alumni = await Alumni.findById(alumniId);
        if (!alumni) {
            return res.status(404).json({ error: 'Alumni not found' });
        }

        const reviews = await Review.find({ alumni: alumniId })
            .populate('student', 'fullName profilePhoto')
            .sort({ createdAt: -1 });

        // Calculate average rating
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
            : 0;

        res.status(200).json({
            reviews,
            averageRating,
            totalReviews
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const studentId = req.user?._id;

        if (!studentId) {
            return res.status(401).json({ error: 'Student must be logged in' });
        }

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Check if the student owns this review
        if (review.student.toString() !== studentId.toString()) {
            return res.status(403).json({ error: 'You can only delete your own reviews' });
        }

        await Review.findByIdAndDelete(reviewId);
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Failed to delete review' });
    }
};

const getAlumniStats = async (req, res) => {
    try {
        const { alumniId } = req.params;

        const alumni = await Alumni.findById(alumniId);
        if (!alumni) {
            return res.status(404).json({ error: 'Alumni not found' });
        }

        const reviews = await Review.find({ alumni: alumniId });
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
            : 0;

        const followerCount = alumni?.followers?.length || 0;
        const followers = alumni?.followers || [];

        res.status(200).json({
            averageRating,
            totalReviews,
            followerCount,
            followers
        });
    } catch (error) {
        console.error('Error fetching alumni stats:', error);
        res.status(500).json({ error: 'Failed to fetch alumni stats' });
    }
};

module.exports = {
    submitReview,
    getAlumniReviews,
    deleteReview,
    getAlumniStats
};
