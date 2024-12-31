import { useGetAllMoviesQuery } from "../../redux/api/movies";
import { useFetchGenresQuery } from "../../redux/api/genre";
import SliderUtil from "../../components/SliderUtil";
import { useState } from "react";
import Loader from "../../components/Loader";

const MoviesContainerPage = () => {
  // API Filters for Movies
  const baseFilters = {
    limit: 10,
    year: "",
    genre: "",
  };

  // Fetch New Movies
  const { data: newResponse, isLoading: isLoadingNew } = useGetAllMoviesQuery({
    ...baseFilters,
    sort: "createdAt",
    order: "desc",
  });
  const newMovies = newResponse?.data || [];

  // Fetch Top Movies
  const { data: topResponse, isLoading: isLoadingTop } = useGetAllMoviesQuery({
    ...baseFilters,
    sort: "numReviews",
    order: "desc",
  });
  const topMovies = topResponse?.data || [];

  const { data: randomResponse, isLoading: isLoadingRandom } =
    useGetAllMoviesQuery({
      ...baseFilters,
      sort: "createdAt",
      order: "asc",
      random:true
    });
  const randomMovies = randomResponse?.data || [];

  // Fetch Genres
  const { data: genreResponse, isLoading: isLoadingGenres } =
    useFetchGenresQuery();
  const genres = genreResponse?.data || [];

  // State for Selected Genre
  const [selectedGenre, setSelectedGenre] = useState(null);

  // Handle Genre Selection
  const handleGenreClick = (genreId) =>
    setSelectedGenre((prev) => (prev === genreId ? null : genreId));

  // Filter Movies Based on Genre
  const filteredMovies = newMovies.filter(
    (movie) => !selectedGenre || movie.genre === selectedGenre
  );

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between items-center p-4 lg:p-8">
      {/* Genre Navigation */}
      <nav className="flex flex-row justify-center md:self-start lg:flex-col w-full lg:w-1/4 mb-8 lg:mb-0 lg:mr-8">
        {isLoadingGenres ? (
          <Loader />
        ) : (
          genres.map((genre) => (
            <button
              key={genre._id}
              className={`hover:transform hover:scale-105 transition-transform duration-500 ease-in-out hover:bg-gray-200 hover:text-black block p-3 rounded text-lg mb-2 ${
                selectedGenre === genre._id ? "bg-teal-100 font-bold" : ""
              }`}
              onClick={() => handleGenreClick(genre._id)}
            >
              {genre.name}
            </button>
          ))
        )}
      </nav>

      {/* Movies Section */}
      <section className="flex flex-col w-full lg:w-3/4">
        {/* Random Movies */}
        <div className="w-full mb-8">
          <h1 className="text-2xl font-semibold mb-4">Recommended for You</h1>
          {isLoadingRandom ? <Loader /> : <SliderUtil data={randomMovies} />}
        </div>

        {/* Top Movies */}
        <div className="w-full mb-8">
          <h1 className="text-2xl font-semibold mb-4">Top Movies</h1>
          {isLoadingTop ? <Loader /> : <SliderUtil data={topMovies} />}
        </div>

        {/* Filtered Movies */}
        <div className="w-full mb-8">
          <h1 className="text-2xl font-semibold mb-4">
            {selectedGenre ? "Movies by Genre" : "All Movies"}
          </h1>
          {isLoadingNew ? <Loader /> : <SliderUtil data={filteredMovies} />}
        </div>
      </section>
    </div>
  );
};

export default MoviesContainerPage;
