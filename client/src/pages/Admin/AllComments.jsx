import { useMemo } from "react";
import { useDeleteReviewMutation, useGetAllMoviesQuery } from "../../redux/api/movies";

const AllComments = () => {
  // Memoized filters for querying movies
  const filters = useMemo(
    () => ({
      sort: "title",
      order: "asc",
      year: "",
      genre: "",
    }),
    []
  );

  // Fetch movies with reviews
  const { data: response, refetch, isLoading, isError } = useGetAllMoviesQuery(filters);
  const movies = response?.data || [];

  // Mutation to delete reviews
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  // Handle review deletion
  const handleDeleteComment = (movieId, reviewId) => async () => {
    try {
      await deleteReview({ movieId, reviewId }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  // UI Feedback for loading or errors
  if (isLoading) return <p className="text-center text-white mt-10">Loading comments...</p>;
  if (isError) return <p className="text-center text-red-500 mt-10">Failed to fetch comments.</p>;

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-6">All Comments</h2>

      {movies.map((movie) => (
        <section
          key={movie._id}
          className="mb-8 bg-[#1A1A1A] p-6 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold mb-4 text-[#FFD700]">
            {movie.title} ({movie.year})
          </h3>

          {movie.reviews.length > 0 ? (
            movie.reviews.map((review) => (
              <div
                key={review._id}
                className="bg-gray-800 p-4 rounded-lg mb-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <strong className="text-[#B0B0B0]">{review.name}</strong>
                  <p className="text-sm text-[#B0B0B0]">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <p className="text-gray-300 mb-4">{review.comment}</p>

                <button
                  className={`text-sm px-4 py-2 rounded ${
                    isDeleting ? "bg-gray-600 cursor-not-allowed" : "bg-red-600 hover:bg-red-500"
                  }`}
                  onClick={handleDeleteComment(movie._id, review._id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews for this movie yet.</p>
          )}
        </section>
      ))}

      {movies.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No movies available.</p>
      )}
    </div>
  );
};

export default AllComments;
