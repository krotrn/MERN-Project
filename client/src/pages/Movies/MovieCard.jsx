import { Link } from "react-router-dom";
import { useFetchOneGenreQuery } from "../../redux/api/genre";

const MovieCard = ({ movie }) => {

  const handleImageError = (e) => {
    e.target.src = "/default-image-placeholder.png";
  };
  const response = useFetchOneGenreQuery(movie.genre)
  const genre = response?.data




  return (
    <div
      key={movie._id}
      className="relative group m-8 shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300"
    >
      {/* Link to Movie Details */}
      <Link to={`/movies/${movie._id}`}>
        <div className="relative">
          {/* Movie Poster */}
          <img
            src={movie.image}
            alt={movie.title || "Movie Poster"}
            onError={handleImageError}
            className="w-full h-[15rem] object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-50"
          />
          {/* Title Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h2 className="text-white text-lg font-semibold text-center px-4">
              {movie.title}
            </h2>
          </div>
        </div>
      </Link>

      {/* Extra Info */}
      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800">{movie.title}</h3>
        {movie.genre && (
          <p className="text-sm text-gray-500">{genre?.name}</p>
        )}
        {movie.year && (
          <p className="text-sm text-gray-500">Released: {movie.year}</p>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
