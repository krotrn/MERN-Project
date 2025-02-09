import { useGetAllMoviesQuery } from "../../redux/api/movies";
import { useFetchGenresQuery } from "../../redux/api/genre";
import MovieCard from "./MovieCard";
import { useEffect, useMemo, useCallback, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import banner from "../../assets/banner.jpg";
import {
  setMoviesFilter,
  setFilterMovies,
} from "../../redux/features/movies/moviesSlice";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";

const AllMovies = () => {
  const dispatch = useDispatch();

  // Filters for API query
  const filters = useMemo(
    () => ({
      sort: "title",
      order: "asc",
      year: "",
      genre: "",
    }),
    []
  );

  // Fetch movies and genres
  const {
    data: moviesResponse,
    error: moviesError,
  } = useGetAllMoviesQuery({ ...filters, limit: 2000 });

  const {
    data: genresResponse,
    error: genresError,
  } = useFetchGenresQuery();

  const genres = genresResponse?.data || [];
  const movies = useMemo(() => moviesResponse?.data || [], [moviesResponse]);
  const { moviesFilter, filteredMovies } = useSelector((state) => state.movies);

  const uniqueYears = useMemo(
    () => Array.from(new Set(movies.map((movie) => movie.year))),
    [movies]
  );

  // Initialize filtered movies
  useEffect(() => {
    dispatch(setFilterMovies(movies));
  }, [dispatch, movies, moviesFilter]);

  // Universal filter function
  const applyFilters = useCallback(() => {
    let filtered = movies;

    // Search filter
    if (moviesFilter.searchTerm) {
      filtered = filtered.filter((movie) =>
        movie.title
          .toLowerCase()
          .includes(moviesFilter.searchTerm.toLowerCase())
      );
    }

    // Genre filter
    if (moviesFilter.selectedGenre) {
      filtered = filtered.filter(
        (movie) => movie.genre === moviesFilter.selectedGenre
      );
    }

    // Year filter
    if (moviesFilter.selectedYear) {
      filtered = filtered.filter(
        (movie) => movie.year === parseInt(moviesFilter.selectedYear, 10)
      );
    }

    // Sorting filter
    if (moviesFilter.selectedSort) {
      switch (moviesFilter.selectedSort) {
        case "new":
          filtered = [...filtered].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          break;
        case "top":
          filtered = [...filtered].sort((a, b) => b.numReviews - a.numReviews);
          break;
        case "random":
          filtered = [...filtered].sort(() => Math.random() - 0.5);
          break;
        default:
          break;
      }
    }

    dispatch(setFilterMovies(filtered));
  }, [movies, moviesFilter, dispatch]);

  useEffect(() => {
    applyFilters();
  }, [moviesFilter, applyFilters]);

  // Handle input changes
  const handleInputChange = (type, value) => {
    dispatch(setMoviesFilter({ [type]: value }));
  };

  // Loader or error handling
  if (moviesError || genresError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-2xl font-bold mb-4">Access Denied</p>
          <p className="text-gray-300 text-lg">
            You need to log in to view this page.
          </p>
          <Link
            to="/login"
            className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-md my-4"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen">
      {/* Banner Section */}
      <div
        className="w-full h-[50rem] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-black opacity-70"></div>
        <div className="relative z-10 text-center text-white mt-[10rem]">
          <h1 className="text-6xl font-bold mb-4">The Movies Hub</h1>
          <p className="text-2xl">
            Cinematic Odyssey: Unveiling the Magic of Movies
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <section className="mt-[-5rem] p-4 w-full max-w-screen-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search Movie"
            className="flex-grow border rounded px-4 py-2 outline-none text-lg"
            value={moviesFilter.searchTerm || ""}
            onChange={(e) => handleInputChange("searchTerm", e.target.value)}
          />

          {/* Genre Filter */}
          <select
            className="border p-2 rounded text-lg"
            value={moviesFilter.selectedGenre || ""}
            onChange={(e) => handleInputChange("selectedGenre", e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre._id} value={genre._id}>
                {genre.name}
              </option>
            ))}
          </select>

          {/* Year Filter */}
          <select
            className="border p-2 rounded text-lg"
            value={moviesFilter.selectedYear || ""}
            onChange={(e) => handleInputChange("selectedYear", e.target.value)}
          >
            <option value="">All Years</option>
            {uniqueYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Sort Options */}
          <select
            className="border p-2 rounded text-lg"
            value={moviesFilter.selectedSort || ""}
            onChange={(e) => handleInputChange("selectedSort", e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="new">Newest</option>
            <option value="top">Top Rated</option>
            <option value="random">Random</option>
          </select>
        </div>
      </section>

      {/* Movies Grid */}
      <Suspense fallback = {<Loader />}>
        <section className="p-4 w-full max-w-screen-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {!filteredMovies || filteredMovies.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No movies found
            </p>
          ) : (
            filteredMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))
          )}
        </section>
      </Suspense>
    </div>
  );
};

export default AllMovies;
