import React, { useState } from "react";
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

  // Handle new genre creation
  const handleCreateGenre = async (e) => {
    e.preventDefault();
    try {
      await createGenre({ name }).unwrap();
      toast.success("Genre created successfully");
      setName("");
      refetch();
    } catch (error) {
      console.error("Create Genre Error:", error);
      toast.error(error.data?.message || "Failed to create genre");
    }
  };

  // Handle genre update
  const handleUpdateGenre = async (e) => {
    e.preventDefault();
    if (!updatingName.trim()) {
      toast.error("Genre Name is Required");
      return;
    }
    try {
      await updateGenre({
        id: selectedGenre._id,
        updatedGenre: { name: updatingName },
      }).unwrap();
      toast.success("Genre updated successfully");
      setModalVisible(false);
      refetch();
    } catch (error) {
      console.error("Update Genre Error:", error);
      toast.error(error.data?.message || "Failed to update genre");
    }
  };

  // Handle genre deletion
  const handleDeleteGenre = async () => {
    if (window.confirm("Are you sure you want to delete this genre?")) {
      try {
        await deleteGenre({ id: selectedGenre._id }).unwrap();
        toast.success("Genre deleted successfully");
        setModalVisible(false);
        refetch();
      } catch (error) {
        console.error("Delete Genre Error:", error);
        toast.error(error.data?.message || "Failed to delete genre");
      }
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="p-6 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Genre Management</h1>

      {/* Create Genre Form */}
      <form
        onSubmit={handleCreateGenre}
        className="w-full max-w-lg mb-8 flex flex-col gap-4"
      >
        <input
          type="text"
          name="genre"
          className="py-3 px-4 border rounded-lg w-full"
          placeholder="Enter new genre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
          required
        />
        <button
          type="submit"
          className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : "Add Genre"}
        </button>
      </form>

      {/* Genre List */}
      <div className="flex flex-wrap gap-4 justify-center w-full max-w-3xl">
        {genres.length > 0 ? (
          genres.map((genre) => (
            <button
              key={genre._id}
              className="bg-white border border-teal-500 text-teal-500 py-2 px-4 rounded-lg hover:bg-teal-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
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
          <p className="text-gray-500">No genres available. Please add a new genre.</p>
        )}
      </div>

      {/* Modal for Updating/Deleting Genre */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Genre</h2>
            <form onSubmit={handleUpdateGenre} className="space-y-4">
              <input
                type="text"
                className="py-3 px-4 border rounded-lg w-full"
                value={updatingName}
                onChange={(e) => setUpdatingName(e.target.value)}
                name="genre"
                autoComplete="off"
                required
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update"}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteGenre}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </form>
            <button
              onClick={() => setModalVisible(false)}
              className="mt-4 text-gray-500 hover:text-gray-700"
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
