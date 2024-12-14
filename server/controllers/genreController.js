import Genre from "../models/Genre.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// Create a new genre
const createGenre = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ 
      status: "error", 
      message: "Missing required field: name." 
    });
  }

  const genreExists = await Genre.findOne({ name });
  if (genreExists) {
    return res.status(409).json({ 
      status: "error", 
      message: "Genre already exists." 
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
      message: `Failed to create genre: ${error.message}` 
    });
  }
});

// Delete a genre
const deleteGenre = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ 
      status: "error", 
      message: "Missing required field: name." 
    });
  }

  try {
    const genre = await Genre.findOne({ name });

    if (!genre) {
      return res.status(404).json({ 
        status: "error", 
        message: "Genre not found." 
      });
    }

    await genre.deleteOne();

    res.status(200).json({
      status: "success",
      message: `Genre "${name}" deleted successfully.`,
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      message: `Failed to delete genre: ${error.message}` 
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
      message: `Failed to fetch genres: ${error.message}` 
    });
  }
});

export { createGenre, deleteGenre, getAllGenres };
