import Genre from "../models/Genre.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// Create a new genre
const createGenre = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      status: "error",
      message: "Missing required field: name.",
    });
  }

  const genreExists = await Genre.findOne({ name });
  if (genreExists) {
    return res.status(409).json({
      status: "error",
      message: "Genre already exists.",
    });
  }

  const newGenre = new Genre({ name });

  try {
    await newGenre.save();

    res.status(201).json({
      status: "success",
      message: "Genre created successfully.",
      data: {
        _id: newGenre._id,
        name: newGenre.name,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Failed to create genre: ${error.message}`,
    });
  }
});

// Delete a genre
const deleteGenre = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Missing required field: id.",
    });
  }

  try {
    const genre = await Genre.findByIdAndDelete(id);

    if (!genre) {
      return res.status(404).json({
        status: "error",
        message: "Genre not found.",
      });
    }
    res.status(200).json({
      status: "success",
      message: `Genre "${genre._id}" deleted successfully.`,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Failed to delete genre: ${error.message}`,
    });
  }
});

// Get all genres
const getAllGenres = asyncHandler(async (req, res) => {
  try {
    const genres = await Genre.find({}).lean();

    res.status(200).json({
      status: "success",
      data: genres,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Failed to fetch genres: ${error.message}`,
    });
  }
});

// Update a Genre
const updateGenre = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  if (!name) {
    return res.status(400).json({
      status: "error",
      message: "Missing required field: name.",
    });
  }

  const genre = await Genre.findById(id);
  if (!genre) {
    return res.status(404).json({
      status: "error",
      message: "Genre not found.",
    });
  }

  genre.name = name;

  try {
    const updatedGenre = await genre.save();

    res.status(200).json({
      status: "success",
      data: {
        _id: updatedGenre._id,
        name: updatedGenre.name,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Failed to update genre: ${error.message}`,
    });
  }
});

const readGenre = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const genre = await Genre.findById(id).lean();
    if (!genre) {
      return res.status(404).json({
        status: "error",
        message: "Genre not found.",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        _id: genre._id,
        name: genre.name,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Failed to retrieve genre: ${error.message}`,
    });
  }
});

export { createGenre, deleteGenre, getAllGenres, updateGenre, readGenre };
