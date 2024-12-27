import SecondaryCard from "./SecondaryCard";
import VideoCard from "./VideoCard";
import RealTimeCard from "./RealTimeCard";
import Sidebar from "../Sildebar/Slidebar";
import { useGetAllMoviesQuery } from "../../../../redux/api/movies";
import { useGetUsersQuery } from "../../../../redux/api/user";
import { useMemo } from "react";

const Main = () => {
  const filters = useMemo(() => ({ sort: "title", order: "asc", year: "", genre: "" }), []);

  const { data: moviesResponse } = useGetAllMoviesQuery(filters);
  const { data: topResponse } = useGetAllMoviesQuery({ ...filters, sort: "numReviews", order: "desc" });
  const { data: response } = useGetUsersQuery();

  const movies = useMemo(() => moviesResponse?.data || [], [moviesResponse]);
  const topMovies = useMemo(() => topResponse?.data || [], [topResponse]);
  const visitors = useMemo(() => response?.data || [], [response]);

  const sumOfCommentsLength = useMemo(
    () => movies.reduce((acc, movie) => acc + (movie.numReviews || 0), 0),
    [movies]
  );

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 md:ml-[16rem] p-4">
        {/* Secondary Cards */}
        <div className="flex flex-wrap justify-center md:justify-between ">
          <SecondaryCard
            pill="Users"
            content={visitors.length}
            gradient="from-teal-500 to-lime-400"
          />
          <SecondaryCard
            pill="Comments"
            content={sumOfCommentsLength}
            gradient="from-[#CCC514] to-[#CDCB8E]"
          />
          <SecondaryCard
            pill="Movies"
            content={movies.length}
            gradient="from-green-500 to-lime-400"
          />
        </div>

        {/* Top Movies */}
        <div className="mt-8">
          <h2 className="text-white text-lg md:text-xl font-bold mb-4">Top Content</h2>
          {topMovies.map((movie) => (
            <VideoCard
              key={movie._id}
              image={movie.image}
              title={movie.title}
              date={movie.year}
              comments={movie.numReviews}
              id = {movie._id}
            />
          ))}
        </div>

        {/* Real-Time Updates */}
        <div className="mt-8">
          <RealTimeCard />
        </div>
      </div>
    </div>
  );
};

export default Main;
