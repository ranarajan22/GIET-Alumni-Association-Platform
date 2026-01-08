const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        enum: [1, 2, 3, 4, 5]
    },
    reviewText: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 500
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    alumni: {
        type: Schema.Types.ObjectId,
        ref: 'Alumni',
        required: true
    },
    studentName: {
        type: String,
        trim: true
    },
    studentPhoto: {
        type: String
    },
    helpful: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Add index to prevent duplicate reviews from same student to same alumni
reviewSchema.index({ student: 1, alumni: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
