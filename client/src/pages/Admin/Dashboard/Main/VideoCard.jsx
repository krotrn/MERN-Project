import { Link } from "react-router-dom";

const VideoCard = ({ image, title, date, comments, id }) => {
  return (
    <Link
      to={`/movies/${id}`}
      className="flex flex-col hover:bg-gray-500 hover:transform hover:scale-105 transition-transform duration-500 px-4 py-2 md:flex-row items-center w-full md:w-[90%] mt-5 rounded-md"
    >
      <div>
        <img
          src={image}
          alt="Card Image"
          className="h-[3rem] md:h-[4rem] w-auto object-cover"
        />
      </div>

      <div className="ml-4 flex-1 text-center md:text-left">
        <h2 className="text-md md:text-lg text-black">{title}</h2>
        <p className="text-gray-900 mb-3 text-sm">{date}</p>
      </div>

      <div className="flex justify-end items-center text-center md:text-right">
        <div className="text-black text-md md:text-lg">{comments}</div>
      </div>
    </Link>
  );
};

export default VideoCard;
