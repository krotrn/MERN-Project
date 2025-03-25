import { Link } from "react-router-dom";
import { useGetAllMoviesQuery } from "../../redux/api/movies.js";
import Loader from "../../components/Loader.jsx";
import SliderUtil from "../../components/SliderUtil.jsx";

const Header = () => {
  const filters = {
    limit: 10,
    sort: "createdAt",
    order: "desc",
    year: "",
    genre: "",
  };

  // Fetch movies data using API query
  const {
    data: response,
    error,
    isLoading,
  } = useGetAllMoviesQuery({ ...filters });

  const { data } = response || {};

  return (
    <header className="flex flex-col mt-6 px-4 md:flex-row justify-between items-center md:items-start">
      {/* Navigation Links */}
      <nav className="w-full md:w-1/4 mb-6 md:mb-0">
        <Link
          to="/"
          className="hover:transform hover:scale-105 transition-transform duration-500 ease-in-out hover:bg-teal-200 block p-3 rounded-sm mb-2 text-lg font-medium text-teal-800"
        >
          Home
        </Link>
        <Link
          to="/movies"
          className="hover:transform hover:scale-105 transition-transform duration-500 ease-in-out hover:bg-teal-200 block p-3 rounded-sm mb-2 text-lg font-medium text-teal-800"
        >
          Browse Movies
        </Link>
      </nav>

      {/* Movies Slider */}
      <div className="w-full md:w-3/4">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <div className="text-red-500 text-center">
            Failed to load movies. Please try again later.
          </div>
        ) : (
          <SliderUtil data={data} />
        )}
      </div>
    </header>
  );
};

export default Header;
