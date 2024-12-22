import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  useCreateMovieMutation,
  useUploadImageMutation,
} from "../../redux/api/movies.js";
import { useFetchGenresQuery } from "../../redux/api/genre.js";
import Loader from "../../components/Loader.jsx";
import { toast } from "react-toastify";

const CreateMovie = () => {
  const navigate = useNavigate();
  const [movieData, setMovieData] = useState({
    title: "",
    year: "",
    genre: "",
    detail: "",
    cast: [],
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [createMovie, { isLoading: isCreatingMovie }] =
    useCreateMovieMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const { data: fetchGenres, isLoading: isFetchingGenre } =
    useFetchGenresQuery();

  const genres = fetchGenres?.data || [];
  const ImagePicker = useRef();

  
  const handlePickClick = () => {
    ImagePicker.current.click()
  }

  const handlePreviewImage = () => {
    if (selectedImage) return URL.createObjectURL(selectedImage);
    return movieData.image ? `${movieData.image}` : "";
  };

  const handleChange = (e) => {
    setMovieData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCastChange = (e) => {
    const castArray = e.target.value.split(",");
    setMovieData((prev) => ({ ...prev, cast: castArray }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedImage(file);
  };

  const handleCreateMovie = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !movieData.title ||
      !movieData.year ||
      !movieData.genre ||
      !movieData.detail ||
      !selectedImage
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      // Upload the image
      const formData = new FormData();
      formData.append("image", selectedImage);

      const uploadResponse = await uploadImage(formData).unwrap();
      const imagePath = uploadResponse?.imagePath;

      if (!imagePath) {
        throw new Error("Failed to upload image.");
      }

      // Create the movie
      const movieToCreate = { ...movieData, image: imagePath };
      await createMovie(movieToCreate).unwrap();

      toast.success("Movie successfully added to the database.");
      navigate("/admin/movies-list");

      // Reset form
      setMovieData({ title: "", year: "", genre: "", detail: "", cast: [] });
      setSelectedImage(null);
    } catch (error) {
      console.error("Error creating movie:", error);
      toast.error(
        error?.data?.message || "Failed to create movie. Please try again."
      );
    }
  };

  return (
    <div className="flex justify-center items-center mt-6">
      <form
        onSubmit={handleCreateMovie}
        className="w-full max-w-2xl p-6 border rounded-lg shadow-md bg-white"
      >
        <h2 className="text-teal-600 text-3xl font-semibold mb-6 text-center">
          Create Movie
        </h2>

        {/* Title */}
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block mb-2 text-gray-700 font-medium"
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={movieData.title}
            onChange={handleChange}
            className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Enter movie title"
            autoComplete="title"
            required
          />
        </div>

        {/* Year */}
        <div className="mb-4">
          <label
            htmlFor="year"
            className="block mb-2 text-gray-700 font-medium"
          >
            Year
          </label>
          <input
            type="number"
            name="year"
            id="year"
            value={movieData.year}
            onChange={handleChange}
            className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
            min="1900"
            max={new Date().getFullYear()}
            autoComplete="year"
            placeholder="Enter release year"
            required
          />
        </div>

        {/* Detail */}
        <div className="mb-4">
          <label
            htmlFor="detail"
            className="block mb-2 text-gray-700 font-medium"
          >
            Detail
          </label>
          <textarea
            name="detail"
            id="detail"
            value={movieData.detail}
            onChange={handleChange}
            autoComplete="detail"
            className="border rounded px-4 py-2 w-full h-32 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Enter movie description"
            required
          ></textarea>
        </div>

        {/* Cast */}
        <div className="mb-4">
          <label
            htmlFor="cast"
            className="block mb-2 text-gray-700 font-medium"
          >
            Cast (comma-separated)
          </label>
          <input
            type="text"
            name="cast"
            id="cast"
            value={movieData.cast}
            onChange={handleCastChange}
            autoComplete="cast"
            className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Enter cast members"
            required
          />
        </div>

        {/* Genre */}
        <div className="mb-4">
          <label
            htmlFor="genre"
            className="block mb-2 text-gray-700 font-medium"
          >
            Genre
          </label>
          <select
            name="genre"
            id="genre"
            value={movieData.genre}
            onChange={handleChange}
            autoComplete="genre"
            className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 text-black focus:ring-teal-400"
            required
          >
            <option value="" disabled>
              {isFetchingGenre ? "Loading genres..." : "Select a genre"}
            </option>
            {genres.map((genre, index) => (
              <option key={index} value={genre._id}>
                {genre.name}
              </option>
            ))}
          </select>
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

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-teal-500 text-white font-semibold py-3 rounded focus:outline-none focus:ring-2 focus:ring-teal-400 hover:bg-teal-600 transition disabled:opacity-50"
          disabled={isCreatingMovie || isUploading || isFetchingGenre}
        >
          {isCreatingMovie || isUploading ? <Loader /> : "Create Movie"}
        </button>
      </form>
    </div>
  );
};

export default CreateMovie;
