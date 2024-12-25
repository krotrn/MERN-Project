import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetSpecificMovieQuery,
  useAddMovieReviewMutation,
} from "../../redux/api/movies";
import MovieTabs from "./MovieTabs";
import Loader from '../../components/Loader'

const MovieDetails = () => {
  const { id: movieId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { data: movieResponse, isLoading: isFetchingMovie, refetch } =
    useGetSpecificMovieQuery(movieId);
  const movie = useMemo(() => movieResponse?.data, [movieResponse]);
  const { userInfo } = useSelector((state) => state.auth);
  const [addMovieReview, { isLoading: loadingMovieReview }] =
    useAddMovieReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await addMovieReview({
        id: movieId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully!");
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong.");
    }
  };

  if (isFetchingMovie) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-2xl">Movie not found.</p>
      </div>
    );
  }

  return (
    <div className="text-gray-900">
      {/* Go Back Link */}
      <div className="mt-4 ml-8">
        <Link
          to="/"
          className="text-teal-500 font-semibold hover:underline"
        >
          &larr; Go Back
        </Link>
      </div>

      {/* Movie Banner and Details */}
      <div className="mt-8">
        {/* Movie Banner */}
        <div className="flex justify-center">
          <img
            src={movie?.image}
            alt={movie?.title}
            className="h-[50vh] max-w-4xl rounded-lg shadow-lg "
          />
        </div>

        {/* Movie Information */}
        <div className="mt-8 px-8 flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8">
          {/* Left Section: Movie Title and Description */}
          <section className="lg:w-3/5 space-y-6">
            <h2 className="text-5xl font-extrabold text-gray-900">{movie?.title}</h2>
            <p className="leading-relaxed text-gray-900">{movie?.detail}</p>
          </section>

          {/* Right Section: Release Date and Cast */}
          <div className="lg:w-2/5 space-y-4">
            <p className="text-2xl font-semibold">
              Release Date: <span className="text-gray-900">{movie?.year}</span>
            </p>
            <div>
              <h3 className="text-xl font-semibold mb-2">Cast:</h3>
              <ul className="list-disc pl-6 text-gray-900">
                {movie?.cast.map((c, index) => (
                  <li key={index}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Tabs */}
      <div className="mt-12 px-8">
        <MovieTabs
          loadingMovieReview={loadingMovieReview}
          userInfo={userInfo}
          submitHandler={submitHandler}
          rating={rating}
          setRating={setRating}
          comment={comment}
          setComment={setComment}
          movie={movie}
        />
      </div>
    </div>
  );
};

export default MovieDetails;
