import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Star, MessageSquare, Heart, Share2 } from 'lucide-react';

const AlumniCard = ({ alumni, onChatClick, onViewProfile }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followCount, setFollowCount] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch alumni reviews and stats on mount
  useEffect(() => {
    const fetchReviewsAndStats = async () => {
      try {
        setLoading(true);
        const [reviewsResponse, statsResponse] = await Promise.all([
          axios.get(`http://localhost:8083/api/reviews/${alumni._id}/reviews`),
          axios.get(`http://localhost:8083/api/reviews/${alumni._id}/stats`)
        ]);

        setReviews(reviewsResponse.data.reviews || []);
        setAverageRating(parseFloat(reviewsResponse.data.averageRating) || 0);
        setFollowCount(statsResponse.data.followerCount || 0);

        // Check if current user is following
        const token = localStorage.getItem('token');
        if (token) {
          const userId = localStorage.getItem('userId');
          const isUserFollowing = statsResponse.data.followers?.includes(userId) || false;
          setIsFollowing(isUserFollowing);
        }
      } catch (error) {
        console.error('Error fetching reviews and stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewsAndStats();
  }, [alumni._id]);

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to follow alumni');
        return;
      }

      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      if (isFollowing) {
        // Unfollow
        await axios.post(
          `http://localhost:8083/api/follow/unfollow/${alumni._id}`,
          {},
          { headers }
        );
        setIsFollowing(false);
        setFollowCount(Math.max(0, followCount - 1));
      } else {
        // Follow
        await axios.post(
          `http://localhost:8083/api/follow/${alumni._id}`,
          {},
          { headers }
        );
        setIsFollowing(true);
        setFollowCount(followCount + 1);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      alert('Failed to update follow status');
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      alert('Please write a review');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.post(
        `http://localhost:8083/api/reviews/${alumni._id}/review`,
        { rating, reviewText },
        { headers }
      );

      if (response.data.review) {
        // Refresh reviews and stats
        const reviewsResponse = await axios.get(`http://localhost:8083/api/reviews/${alumni._id}/reviews`);
        setReviews(reviewsResponse.data.reviews || []);
        setAverageRating(parseFloat(reviewsResponse.data.averageRating) || 0);
        
        setReviewText('');
        setRating(5);
        setShowReviewModal(false);
        alert('Review submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-100 dark:border-slate-700">
      {/* Header with profile image and name */}
      <div className="h-24 bg-gradient-to-r from-cyan-600 to-blue-600 relative flex items-center px-4">
        <div className="absolute left-4 bottom-0 translate-y-1/2">
          <img
            src={alumni.profilePhoto || 'https://via.placeholder.com/80'}
            alt={alumni.fullName}
            className="w-20 h-20 rounded-full border-4 border-white object-cover"
          />
        </div>
        <h3 className="text-lg font-bold text-white ml-28">{alumni.fullName}</h3>
      </div>

      {/* Content */}
      <div className="pt-12 px-4 pb-4">
        <div className="mb-2">
          <p className="text-sm text-gray-600 dark:text-slate-400">{alumni.fieldOfStudy || alumni.field || alumni.company || 'Alumni'}</p>
          <p className="text-xs text-gray-500 dark:text-slate-500">{alumni.course || ''}</p>
        </div>

        {/* Rating section */}
        <div className="flex items-center justify-between mb-3 py-2 border-t border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">{averageRating}</span>
            <span className="text-xs text-gray-500 dark:text-slate-400">({reviews.length})</span>
          </div>
          <button
            onClick={handleFollow}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
              isFollowing
                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                : 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-200 dark:hover:bg-cyan-900/50'
            }`}
          >
            {isFollowing ? `Following (${followCount})` : `Follow (${followCount})`}
          </button>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            onClick={() => onChatClick && onChatClick(alumni)}
            className="flex items-center justify-center gap-1 bg-cyan-50 dark:bg-cyan-900/30 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 text-cyan-700 dark:text-cyan-400 py-2 rounded transition text-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Chat</span>
          </button>
          <button
            onClick={() => setShowReviewModal(true)}
            className="flex items-center justify-center gap-1 bg-yellow-50 dark:bg-yellow-900/30 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 py-2 rounded transition text-sm"
          >
            <Star className="w-4 h-4" />
            <span className="hidden sm:inline">Review</span>
          </button>
        </div>
        <button
          onClick={() => onViewProfile && onViewProfile(alumni)}
          className="w-full flex items-center justify-center gap-1 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 py-2 rounded transition text-sm font-semibold"
        >
          View Full Profile
        </button>

        {/* Recent reviews preview */}
        {reviews.length > 0 && (
          <div className="mt-3 p-2 bg-gray-50 dark:bg-slate-700/50 rounded text-xs">
            <p className="font-semibold text-gray-700 dark:text-slate-300 mb-1">Recent Review:</p>
            <p className="text-gray-600 dark:text-slate-400 line-clamp-2">{reviews[reviews.length - 1].review}</p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Rate & Review {alumni.fullName}</h3>

            {/* Rating selector */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Rating</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition"
                  >
                    <Star
                      className={`w-8 h-8 cursor-pointer ${
                        star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review text */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Your Review</p>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this alumni..."
                className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                rows="4"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={submitting || !reviewText.trim()}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

AlumniCard.propTypes = {
  alumni: PropTypes.shape({
    _id: PropTypes.string.required,
    fullName: PropTypes.string,
    field: PropTypes.string,
    company: PropTypes.string,
    profilePhoto: PropTypes.string,
    followers: PropTypes.number,
    isFollowed: PropTypes.bool,
    reviews: PropTypes.array,
  }),
  onChatClick: PropTypes.func,
  onViewProfile: PropTypes.func,
};

export default AlumniCard;
