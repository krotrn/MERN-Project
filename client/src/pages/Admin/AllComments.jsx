import { useMemo} from "react";
import { useDeleteReviewMutation, useGetAllMoviesQuery } from "../../redux/api/movies";

const AllComments = () => {
  const filters = useMemo(
    () => ({
      sort: "title",
      order: "asc",
      year: "",
      genre: "",
    }),
    []
  );

  const { data: response, refetch } = useGetAllMoviesQuery(filters);
  const movies = response?.data || [];
  console.log(movies);

  const [deleteReview] = useDeleteReviewMutation();

  const handleDeleteComment = (movieId, reviewId) => async () => {
    try {
      await deleteReview({movieId, reviewId}).unwrap();
      refetch();
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <div>
      {movies?.map((m) => (
        <section
          key={m._id}
          className="flex flex-col justify-center items-center"
        >
          {m?.reviews.map((review) => (
            <div
              key={review._id}
              className="bg-[#1A1A1A] p-4 rounded-lg w-[50%] mt-[2rem]"
            >
              <div className="flex justify-between">
                <strong className="text-[#B0B0B0]">{review.name}</strong>
                <p className="text-[#B0B0B0]">
                  {review.createdAt.substring(0, 10)}
                </p>
              </div>

              <p className="my-4">{review.comment}</p>

              <button
                className="text-red-500"
                onClick={() => handleDeleteComment(m._id, review._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}

export default AllComments