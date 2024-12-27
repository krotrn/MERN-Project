import SecondaryCard from "./SecondaryCard";
import VideoCard from "./VideoCard";
import RealTimeCard from "./RealTimeCard";
import { useGetAllMoviesQuery } from "../../../../redux/api/movies";
import { useGetUsersQuery } from "../../../../redux/api/user";
import { useMemo } from "react";

const Main = () => {
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
    isLoading: isLoadingMovies,
    error: moviesError,
  } = useGetAllMoviesQuery(filters);

  // Fetch Top Movies
  const { data: topResponse, isLoading: isLoadingTop } = useGetAllMoviesQuery({
    ...filters,
    sort: "numReviews",
    order: "desc",
  });

  const topMovies = topResponse?.data || [];

  const movies = useMemo(() => moviesResponse?.data || [], [moviesResponse]);
  const { data: response } = useGetUsersQuery();
  const visitors = response?.data;
  const totalCommentsLength = movies?.map((m) => m.numReviews);
  const sumOfCommentsLength = totalCommentsLength?.reduce(
    (acc, length) => acc + length,
    0
  );

  return (
    <div>
      <section className="flex justify-around">
        <div className="ml-[14rem] mt-10">
          <div className="-translate-x-4 flex">
            <SecondaryCard
              pill="Users"
              content={visitors?.length}
              info="20.2k more then usual"
              gradient="from-teal-500 to-lime-400"
            />
            <SecondaryCard
              pill="Comments"
              content={sumOfCommentsLength}
              info="742.8 more then usual"
              gradient="from-[#CCC514] to-[#CDCB8E]"
            />
            <SecondaryCard
              pill="Movies"
              content={movies?.length}
              info="372+ more then usual"
              gradient="from-green-500 to-lime-400"
            />
          </div>
          <div className="flex justify-between w-[90%] text-white mt-10 font-bold">
            <p>Top Content</p>
            <p>Comments</p>
          </div>

          {topMovies?.map((movie) => (
            <VideoCard
              key={movie._id}
              image={movie.image}
              title={movie.title}
              date={movie.year}
              comments={movie.numReviews}
            />
          ))}
        </div>

        <div>
          <RealTimeCard />
        </div>
      </section>
    </div>
  );
};

export default Main;
