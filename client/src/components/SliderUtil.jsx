import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MovieCard from "../pages/Movies/MovieCard";

const SliderUtil = ({data}) => {
  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    lazyLoad: "ondemand",
    slidesToShow: 4,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 1024, // Tablet
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768, // Mobile
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // Small mobile
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Check if there's no data
  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-[200px] text-gray-500 text-lg">
        No movies to display.
      </div>
    );
  }

  return (
    <div className="my-6">
      <Slider {...settings}>
        {data?.map((movie) => (
          <div key={movie._id} className="px-2">
            <MovieCard movie={movie} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SliderUtil;
