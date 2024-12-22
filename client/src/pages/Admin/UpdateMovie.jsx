import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  useDeleteMovieMutation,
  useGetSpecificMovieQuery,
  useUpdateMovieMutation,
  useUploadImageMutation,
} from "../../redux/api/movies.js";

import { useFetchGenresQuery } from "../../redux/api/genre";
import Loader from "../../components/Loader.jsx";
import { toast } from "react-toastify";

const UpdateMovie = () => {
  const ImagePicker = useRef()
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: genreResponse, isLoading: isFetchingGenre } =
    useFetchGenresQuery();
  const genres = genreResponse?.data || [];

  const { data: movieResponse, isLoading: isFetchingMovie } =
    useGetSpecificMovieQuery(id);
  const movie = useMemo(() => movieResponse?.data, [movieResponse]);

  const [updateMovie, { isLoading: isUpdating }] = useUpdateMovieMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const [deleteMovie, { isLoading: isDeleting }] = useDeleteMovieMutation();

  const [movieData, setMovieData] = useState({
    title: "",
    year: 0,
    genre: "",
    detail: "",
    cast: "",
    image: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (movie) {
      setMovieData({
        title: movie.title || "",
        year: movie.year || "",
        genre: movie.genre || "",
        detail: movie.detail || "",
        cast: movie.cast?.join(", ") || "",
        image: movie.image || "",
      });
    }
  }, [movie]);

  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovieData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handlePickClick = () => {
    ImagePicker.current.click()
  }

  const handlePreviewImage = () => {
    if (selectedImage) return URL.createObjectURL(selectedImage);
    return movieData.image ? `${movieData.image}` : "";
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (
      !movieData.title ||
      !movieData.year ||
      !movieData.genre ||
      !movieData.detail
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      let imagePath = movieData.image;

      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        const { imagePath: uploadedImagePath } = await uploadImage(
          formData
        ).unwrap();
        imagePath = uploadedImagePath;
        if (!imagePath) {
          throw new Error("Failed to upload image.");
        }
      }

      const updatedMovie = { ...movieData, image: imagePath };

      await updateMovie({ id, updatedMovie }).unwrap();
      toast.success("Movie updated successfully!");
      navigate("/admin/movies-list");
    } catch (error) {
      console.log("Error in Updating Image : ", error);
      toast.error(
        error?.data?.messsge || "Failed to update the movie. Please try again."
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMovie(id).unwrap();
      toast.success("Movie deleted successfully!");
      navigate("/admin/movies-list");
    } catch {
      toast.error("Failed to delete the movie. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <form
        onSubmit={handleUpdate}
        className="w-full max-w-3xl p-8 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-2xl font-bold text-teal-600 mb-6 text-center">
          Update Movie
        </h2>

        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={movieData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
            required
          />
        </div>

        {/* Year */}
        <div className="mb-4">
          <label htmlFor="year" className="block text-gray-700 mb-2">
            Year
          </label>
          <input
            type="number"
            name="year"
            id="year"
            value={movieData.year}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
            min="1900"
            max={new Date().getFullYear()}
            required
          />
        </div>

        {/* Genre */}
        <div className="mb-4">
          <label htmlFor="genre" className="block text-gray-700 mb-2">
            Genre
          </label>
          {!isFetchingGenre ? (
            <select
              name="genre"
              id="genre"
              value={movieData.genre}
              onChange={handleChange}
              className="w-full text-black px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            >
              <option value="" disabled>
                {isFetchingGenre ? "Loading genres..." : "Select a genre"}
              </option>
              {genres.map((genre) => (
                <option key={genre._id} value={genre._id}>
                  {genre.name}
                </option>
              ))}
            </select>
          ) : (
            <Loader />
          )}
        </div>

        {/* Cast */}
        <div className="mb-4">
          <label htmlFor="cast" className="block text-gray-700 mb-2">
            Cast (comma-separated)
          </label>
          <input
            type="text"
            name="cast"
            id="cast"
            value={movieData.cast}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
            required
          />
        </div>

        {/* Detail */}
        <div className="mb-4">
          <label htmlFor="detail" className="block text-gray-700 mb-2">
            Detail
          </label>
          <textarea
            name="detail"
            id="detail"
            value={movieData.detail}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
            rows="4"
            required
          ></textarea>
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label htmlFor="image" className="block text-gray-700 mb-2">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            id="image"
            onChange={handleImageChange}
            ref={ImagePicker}
            className="hidden"
          />
          <button className='px-2 py-2 bg-[#a4abb9] border cursor-pointer hover:bg-[#b3b9c6] ' type="button" onClick={handlePickClick}>Pick an Image</button>
          {handlePreviewImage() && (
            <img
              src={handlePreviewImage()}
              alt="Preview Image"
              className="mt-4 w-32 h-32 object-cover rounded border"
            />
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isUpdating || isUploading || isFetchingMovie}
            className="flex-1 bg-teal-500 text-white py-2 rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            {isUpdating || isUploading ? <Loader /> : "Update Movie"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            {isDeleting ? <Loader /> : "Delete Movie"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateMovie;
