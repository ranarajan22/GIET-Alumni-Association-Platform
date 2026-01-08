# Alumni Connect - Rating, Review & Follow System Implementation Guide

## Overview
This document outlines the complete implementation of the rating, review, and follow system for the Alumni Connect platform. Students can now rate and review alumni, follow them, and alumni can see their follower count and average rating on their dashboard.

## Features Implemented

### 1. **Student Network - Alumni Card Component**
- **File**: `frontend/src/components/AlumniCard.jsx`
- **Features**:
  - Display alumni profile with photo and basic info
  - Show average rating (calculated from all reviews)
  - Show follower count
  - Follow/Unfollow functionality
  - Review submission modal with 1-5 star rating
  - Recent review preview
  - Chat button integration
  - Loading states and error handling

### 2. **Alumni Reviews System**
- **Backend Model**: `backend/Models/review.js`
  - Fields: `rating` (1-5), `reviewText`, `student`, `alumni`, `studentName`, `studentPhoto`, `createdAt`, `updatedAt`
  - Unique index on `[student, alumni]` to prevent duplicate reviews from same student

- **Controller**: `backend/Controllers/ReviewController.js`
  - `submitReview()`: Create or update reviews for an alumni
  - `getAlumniReviews()`: Fetch all reviews for an alumni with average rating
  - `deleteReview()`: Delete own reviews (protected)
  - `getAlumniStats()`: Get alumni stats including follower count and average rating

- **Routes**: `backend/Routes/reviewRoutes.js`
  - `POST /reviews/:alumniId/review` - Submit/update review (protected)
  - `GET /reviews/:alumniId/reviews` - Get all reviews for alumni
  - `DELETE /reviews/:reviewId` - Delete review (protected)
  - `GET /reviews/:alumniId/stats` - Get alumni stats

### 3. **Follow System**
- **Backend Models**:
  - `alumni.js`: Has `followers` array to track student followers
  - `users.js`: Has `followingAlumni` array to track alumni followed by student

- **Controller**: Updated `backend/Controllers/FollowController.js`
  - `followAlumni()`: Add student to alumni's followers and alumni to student's followingAlumni
  - `unfollowAlumni()`: Remove from both arrays
  - Both protected routes using `protectRoute` middleware

- **Routes**: Updated `backend/Routes/FollowRoutes.js`
  - `POST /follow/:alumniId` - Follow alumni (protected)
  - `POST /follow/unfollow/:alumniId` - Unfollow alumni (protected)

### 4. **Alumni Dashboard - Success Metrics**
- **Component**: Updated `frontend/src/components/SuccessMetrics.jsx`
  - Added "Followers" metric to display follower count
  - Updated grid to 5 columns (lg:grid-cols-5) to accommodate new metric
  - Displays: Followers, Students Connected, Mentorships Completed, Jobs Filled, Avg Rating

- **Integration**: Updated `frontend/src/pages/Dashboard.jsx`
  - Modified `fetchAlumniData()` to fetch reviews stats alongside alumni stats
  - Merges data: `followers` and `averageRating` from review stats endpoint
  - Passes combined stats object to SuccessMetrics component

### 5. **Network Component Integration**
- **File**: Updated `frontend/src/components/Network.jsx`
- **Logic**:
  - For **alumni viewing students**: Uses original simple card
  - For **students viewing alumni**: Uses new `AlumniCard` component with ratings and follow

## API Endpoints Summary

### Review Endpoints
```
POST   /api/reviews/:alumniId/review          - Submit/update review (Protected)
GET    /api/reviews/:alumniId/reviews         - Get all reviews for alumni
DELETE /api/reviews/:reviewId                 - Delete review (Protected)
GET    /api/reviews/:alumniId/stats           - Get alumni stats with ratings
```

### Follow Endpoints
```
POST   /api/follow/:alumniId                  - Follow alumni (Protected)
POST   /api/follow/unfollow/:alumniId         - Unfollow alumni (Protected)
```

## Database Schema Changes

### Review Model
```javascript
{
  rating: Number (1-5),
  reviewText: String,
  student: ObjectId (ref: User),
  alumni: ObjectId (ref: Alumni),
  studentName: String,
  studentPhoto: String,
  helpful: Number (default: 0),
  timestamps: true
}
```

### Alumni Model (Updated)
```javascript
followers: [{ type: ObjectId, ref: 'User' }]  // Already exists
```

### User Model (Updated)
```javascript
followingAlumni: [{ type: ObjectId, ref: 'Alumni' }]  // Already exists
```

## Frontend Data Flow

### Getting Alumni Reviews
1. AlumniCard mounts
2. Fetches reviews: `GET /api/reviews/:alumniId/reviews`
3. Fetches stats: `GET /api/reviews/:alumniId/stats` (includes followerCount)
4. Displays average rating and follower count
5. Shows "Recent Review" preview

### Submitting a Review
1. Student clicks "Review" button
2. Modal opens with star rating selector
3. Student enters review text (min 10 chars)
4. Clicks "Submit Review"
5. POST to `/api/reviews/:alumniId/review` with rating and reviewText
6. On success: Refreshes reviews list and recalculates average rating
7. Clears modal and shows success message

### Following an Alumni
1. Student clicks "Follow" button
2. Button sends POST to `/api/follow/:alumniId`
3. UI updates: Button shows "Following (count)" in red
4. Follower count increments

### Unfollowing
1. Student clicks "Following" button
2. Button sends POST to `/api/follow/unfollow/:alumniId`
3. UI updates: Button shows "Follow (count)" in blue
4. Follower count decrements

### Alumni Dashboard Updates
1. Alumni Dashboard fetches profile and stats
2. Parallel requests:
   - `GET /api/alumni-list/profile/:userId`
   - `GET /api/alumni-list/stats/:userId`
   - `GET /api/reviews/:userId/stats` (reviews endpoint)
3. Merges data with followers and averageRating
4. SuccessMetrics component displays:
   - Followers count
   - Average rating from reviews
   - Other existing metrics

## Files Created/Modified

### Created Files
- `backend/Models/review.js` - New review model
- `backend/Controllers/ReviewController.js` - New review controller
- `backend/Routes/reviewRoutes.js` - New review routes

### Modified Files
- `frontend/src/components/AlumniCard.jsx` - Complete rewrite with review/follow features
- `frontend/src/components/Network.jsx` - Integrated AlumniCard for student view
- `frontend/src/components/SuccessMetrics.jsx` - Added followers metric
- `frontend/src/pages/Dashboard.jsx` - Updated to fetch review stats
- `backend/Controllers/FollowController.js` - Updated for protected routes
- `backend/Routes/FollowRoutes.js` - Added simplified endpoints
- `backend/server.js` - Added review routes import and usage

## Testing Checklist

### Setup
- [ ] Ensure backend is running on localhost:8083
- [ ] Ensure frontend is running on localhost:5173
- [ ] Database connection is active

### Student Features
- [ ] Login as a student
- [ ] Navigate to Network/Alumni section
- [ ] View alumni cards with ratings and follower counts
- [ ] Click "Follow" button - verify state changes and count increments
- [ ] Click "Following" button - verify state changes and count decrements
- [ ] Click "Review" button - modal opens
- [ ] Rate an alumni (1-5 stars)
- [ ] Write a review (10+ characters)
- [ ] Submit review - verify success message
- [ ] View recent review preview on card
- [ ] Verify average rating updates
- [ ] Follow multiple alumni

### Alumni Features
- [ ] Login as an alumni
- [ ] Go to Dashboard
- [ ] Verify "Followers" metric displays in Success Metrics
- [ ] Follow count should match number of students following
- [ ] "Avg Rating" should calculate from submitted reviews
- [ ] Rating should update when students submit/update reviews

### Edge Cases
- [ ] Test with no reviews (averageRating should be 0)
- [ ] Test with single review
- [ ] Test with multiple reviews
- [ ] Test updating own review (should update, not duplicate)
- [ ] Test after logout and login again
- [ ] Test on mobile viewport

### API Testing (Using Postman/Thunder Client)
```bash
# Submit a review (requires auth token)
POST http://localhost:8083/api/reviews/:alumniId/review
Headers: Authorization: Bearer <token>
Body: { "rating": 5, "reviewText": "Great mentor!" }

# Get reviews
GET http://localhost:8083/api/reviews/:alumniId/reviews

# Get alumni stats
GET http://localhost:8083/api/reviews/:alumniId/stats

# Follow alumni (requires auth token)
POST http://localhost:8083/api/follow/:alumniId
Headers: Authorization: Bearer <token>

# Unfollow alumni (requires auth token)
POST http://localhost:8083/api/follow/unfollow/:alumniId
Headers: Authorization: Bearer <token>
```

## Future Enhancements

1. **Review Management**
   - Edit review functionality
   - Delete review with confirmation
   - Mark review as helpful/unhelpful
   - Reply to reviews

2. **Advanced Filtering**
   - Filter alumni by rating
   - Sort by most followers
   - Sort by recent reviews

3. **Notifications**
   - Notify alumni when they get a new follower
   - Notify alumni when they receive a review
   - Email notifications

4. **Real-time Updates**
   - WebSocket for live follower count updates
   - Real-time review notifications

5. **Analytics**
   - Rating distribution chart
   - Review sentiment analysis
   - Alumni ranking leaderboard

## Troubleshooting

### Reviews not showing
- Check network tab for API errors
- Verify database connection
- Check console for error messages
- Ensure review data is being saved to database

### Follow button not working
- Verify user is logged in (token in localStorage)
- Check console for auth errors
- Verify token hasn't expired
- Check if alumni exists in database

### Stats not updating
- Refresh the page to fetch latest data
- Check if Promise.all() is correctly awaiting both API calls
- Verify review stats endpoint is returning correct data

### Rating not calculating
- Ensure reviews have valid rating field (1-5)
- Check ReviewController.getAlumniReviews() calculation logic
- Verify all review documents are in database

## Notes
- All protected routes require valid Bearer token in Authorization header
- Review uniqueness is enforced per student-alumni pair
- Follower count is real-time and updates immediately
- Average rating is calculated server-side for consistency
