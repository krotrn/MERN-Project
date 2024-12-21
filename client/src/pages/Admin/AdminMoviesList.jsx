import { Link } from "react-router-dom";
import { useGetAllMoviesQuery } from "../../redux/api/movies.js";
import { Suspense, useState } from "react";
import Loader from "../../components/Loader";
import { useFetchGenresQuery } from "../../redux/api/genre.js";

const AdminMoviesList = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    limit: 10,
    sort: "createdAt",
    order: "desc",
    year: "",
    genre: "",
  });

  const {
    data: response,
    error,
    isLoading,
  } = useGetAllMoviesQuery({ page, ...filters });

  const {
    data: movies = [],
    totalMovies = 0,
    totalPages = 1,
    currentPage = 1,
  } = response || {};

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1); // Reset to the first page when filters change
  };

  const { data: fetchGenres, isLoading: isFetchingGenre } = useFetchGenresQuery();
  const genres = fetchGenres?.data || [];

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          All Movies <span className="text-teal-500">({totalMovies})</span>
        </h1>
        <Link
          to="/admin/movies/create"
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded shadow-md"
        >
          Add New Movie
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-between mb-6 gap-4">
        <div className="flex gap-4 items-center">
          <input
            type="number"
            name="year"
            placeholder="Filter by Year"
            value={filters.year}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-black"
          />
          <select
            name="genre"
            value={filters.genre}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-black"
          >
            <option value="">
              {isFetchingGenre ? "Loading genres..." : "Select a genre"}
            </option>
            {genres.map((genre) => (
              <option key={genre._id} value={genre._id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4 items-center">
          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-black"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="name">Sort by Name</option>
          </select>
          <select
            name="order"
            value={filters.order}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-black"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Movies List */}
      <Suspense fallback={<Loader />}>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : error ? (
          <div className="text-red-500 font-semibold text-center">
            Failed to load movies. Please try again later.
          </div>
        ) : movies.length === 0 ? (
          <div className="text-gray-500 text-center font-semibold">
            No movies found matching the criteria.
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">
              Total Movies Found: <span className="font-semibold">{totalMovies}</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {movies.map((movie) => (
                <div
                  key={movie._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800 truncate">
                      {movie.title}
                    </h2>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {movie.detail}
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <Link
                        to={`/admin/movies/update/${movie._id}`}
                        className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-1 px-3 rounded"
                      >
                        Update
                      </Link>
                      <span className="text-sm text-gray-500">
                        {new Date(movie.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="bg-teal-500 w-fit text-white font-bold py-1 px-3 rounded mt-2">
                      {genres
                        .filter((genre) => movie.genre === genre._id)
                        .map((genre) => genre.name)
                        .join(", ")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Suspense>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminMoviesList;
