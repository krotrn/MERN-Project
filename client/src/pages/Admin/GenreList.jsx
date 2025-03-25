import { useState } from "react";
import {
  useFetchGenresQuery,
  useCreateGenreMutation,
  useUpdateGenreMutation,
  useDeleteGenreMutation,
} from "../../redux/api/genre.js";
import { toast } from "react-toastify";
import Loader from "../../components/Loader.jsx";

const GenreList = () => {
  const { data: response, refetch, isLoading } = useFetchGenresQuery();
  const genres = response?.data || [];

  const [name, setName] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createGenre, { isLoading: isCreating }] = useCreateGenreMutation();
  const [updateGenre, { isLoading: isUpdating }] = useUpdateGenreMutation();
  const [deleteGenre, { isLoading: isDeleting }] = useDeleteGenreMutation();

  const closeModal = () => {
    setModalVisible(false);
    setSelectedGenre(null);
    setUpdatingName("");
  };

  const handleCreateGenre = async (e) => {
    e.preventDefault();
    if (!name.trim() || name.length > 50) {
      toast.error(
        "Genre name is required and must be less than 50 characters."
      );
      return;
    }

    try {
      await createGenre({ name: name.trim() }).unwrap();
      toast.success("Genre created successfully!");
      setName("");
      refetch();
    } catch (error) {
      console.error("Create Genre Error:", error);
      toast.error(error.data?.message || "Failed to create genre.");
    }
  };

  const handleUpdateGenre = async (e) => {
    e.preventDefault();
    if (!updatingName.trim() || updatingName.length > 50) {
      toast.error(
        "Genre name is required and must be less than 50 characters."
      );
      return;
    }

    try {
      await updateGenre({
        id: selectedGenre._id,
        updatedGenre: { name: updatingName.trim() },
      }).unwrap();
      toast.success("Genre updated successfully!");
      closeModal();
      refetch();
    } catch (error) {
      console.error("Update Genre Error:", error);
      toast.error(error.data?.message || "Failed to update genre.");
    }
  };

  const handleDeleteGenre = async () => {
    try {
      await deleteGenre({ id: selectedGenre._id }).unwrap();
      toast.success("Genre deleted successfully!");
      closeModal();
      refetch();
    } catch (error) {
      console.error("Delete Genre Error:", error);
      toast.error(error.data?.message || "Failed to delete genre.");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="p-6 min-h-screen flex flex-col items-center bg-linear-to-br from-gray-100 to-gray-300 backdrop-blur-md rounded-lg shadow-2xl">
      <h1 className="text-4xl font-extrabold mb-8 text-teal-700 drop-shadow-lg">
        Genre Management
      </h1>

      <form
        onSubmit={handleCreateGenre}
        className="w-full max-w-lg mb-8 flex flex-col gap-6 bg-white bg-opacity-80 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-teal-500"
      >
        <input
          type="text"
          name="genre"
          className="py-3 px-4 border rounded-xl w-full focus:ring-4 focus:ring-teal-400 focus:outline-hidden text-gray-700 placeholder-gray-500 shadow-xs"
          placeholder="Enter new genre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
          required
        />
        <button
          type="submit"
          className="bg-linear-to-r from-teal-500 to-green-400 text-white py-3 px-6 rounded-xl hover:from-teal-600 hover:to-green-500 focus:outline-hidden focus:ring-4 focus:ring-teal-400"
          disabled={isCreating}
        >
          {isCreating ? <Loader /> : "Add Genre"}
        </button>
      </form>

      <div className="flex flex-wrap gap-6 justify-center w-full max-w-3xl">
        {genres.length > 0 ? (
          genres.map((genre) => (
            <button
              key={genre._id}
              className="bg-white bg-opacity-80 border border-teal-500 text-teal-700 py-2 px-4 rounded-xl hover:bg-teal-500 hover:text-white focus:outline-hidden focus:ring-4 focus:ring-teal-400 shadow-lg transition-transform transform hover:scale-105"
              onClick={() => {
                setModalVisible(true);
                setSelectedGenre(genre);
                setUpdatingName(genre.name);
              }}
            >
              {genre.name}
            </button>
          ))
        ) : (
          <p className="text-gray-500">
            No genres available. Please add a new genre.
          </p>
        )}
      </div>

      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-lg border border-teal-500">
            <h2 className="text-2xl font-bold mb-6 text-teal-600 drop-shadow-xs">
              Edit Genre
            </h2>
            <form onSubmit={handleUpdateGenre} className="space-y-6">
              <input
                type="text"
                className="py-3 px-4 border rounded-xl w-full focus:ring-4 focus:ring-teal-400 focus:outline-hidden text-gray-700 placeholder-gray-500 shadow-xs"
                value={updatingName}
                onChange={(e) => setUpdatingName(e.target.value)}
                name="genre"
                autoComplete="off"
                required
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-linear-to-r from-teal-500 to-green-400 text-white py-3 px-6 rounded-xl hover:from-teal-600 hover:to-green-500 focus:outline-hidden focus:ring-4 focus:ring-teal-400"
                  disabled={isUpdating}
                >
                  {isUpdating ? <Loader /> : "Update"}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteGenre}
                  className="bg-linear-to-r from-red-500 to-pink-400 text-white py-3 px-6 rounded-xl hover:from-red-600 hover:to-pink-500 focus:outline-hidden focus:ring-4 focus:ring-red-400"
                  disabled={isDeleting}
                >
                  {isDeleting ? <Loader /> : "Delete"}
                </button>
              </div>
            </form>
            <button
              onClick={closeModal}
              className="mt-6 text-gray-500 hover:text-gray-700 focus:outline-hidden transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenreList;
