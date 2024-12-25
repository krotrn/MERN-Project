import { Link } from "react-router-dom";

const MovieTabs = ({
  userInfo,
  submitHandler,
  comment,
  setComment,
  movie,
  rating,
  setRating,
}) => {
  return (
    <div className="space-y-6">
      {/* Review Form */}
      <section className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">Write a Review</h2>
        {userInfo ? (
          <form onSubmit={submitHandler} className="space-y-4">
            {/* Rating Input */}
            <div>
              <label
                htmlFor="rating"
                className="block text-lg font-medium text-gray-300 mb-2"
              >
                Your Rating
              </label>
              <select
                id="rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-white"
              >
                <option value="">Select a Rating...</option>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>

            {/* Comment Input */}
            <div>
              <label
                htmlFor="comment"
                className="block text-lg font-medium text-gray-300 mb-2"
              >
                Your Review
              </label>
              <textarea
                id="comment"
                rows="4"
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about the movie..."
                className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-white resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
            >
              Submit Review
            </button>
          </form>
        ) : (
          <p className="text-gray-300">
            Please <Link to="/login" className="text-teal-500">Sign In</Link> to write a review.
          </p>
        )}
      </section>

      {/* Reviews Section */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Reviews</h2>
        {movie?.reviews.length === 0 ? (
          <p className="text-gray-400">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-6">
            {movie?.reviews.map((review) => (
              <div
                key={review._id}
                className="bg-[#1A1A1A] p-4 rounded-lg shadow-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <strong className="text-lg text-teal-400">
                    {review.username}
                  </strong>
                  <span className="text-gray-400 text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-300 mb-2">{review.comment}</p>
                <div className="text-yellow-400">
                  {"★".repeat(review.rating).padEnd(5, "☆")}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MovieTabs;
