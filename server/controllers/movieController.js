import asyncHandler from "../middlewares/asyncHandler.js";
import Movie from "../models/Movie.js";

const createMovie = asyncHandler(async (req, res) => {
  const { title, image, year, genre, detail, cast, reviews } = req.body;

  if (!title.trim() || !year || !genre.trim() || !detail.trim()) {
    return res.status(400).json({
      status: "fail",
      message: "Title, Year, Genre, and Detail are required fields.",
    });
  }

  try {
    const existingMovie = await Movie.findOne({
      title: { $regex: `^${title.trim()}$`, $options: "i" },
    });

    if (existingMovie) {
      return res.status(400).json({
        status: "fail",
        message: "A movie with this title already exists.",
      });
    }

    const newMovieData = {
      title,
      image,
      year,
      genre,
      detail,
      cast,
      reviews,
    };

    const newMovie = new Movie(newMovieData);
    const savedMovie = await newMovie.save();

    res.status(201).json({
      status: "success",
      data: savedMovie,
      message: "Movie created successfully!",
    });
  } catch (error) {
    console.error("Error in createMovie:", error.message);

    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred while creating the movie.",
    });
  }
});

const getAllMovies = asyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
      year,
      genre,
    } = req.query;

    const query = {};
    if (year) query.year = year;
    if (genre) query.genre = genre;

    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const skip = (pageNumber - 1) * pageSize;

    const sortOrder = order === "asc" ? 1 : -1;

    const movies = await Movie.find(query)
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(pageSize);

    const totalMovies = await Movie.countDocuments(query);

    res.status(200).json({
      status: "success",
      results: movies.length,
      totalMovies,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalMovies / pageSize),
      data: movies,
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred while fetching the movies.",
    });
  }
});

const getSpecificMovie = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await Movie.findById(id).lean();

    if (!movie) {
      return res.status(404).json({
        status: "fail",
        message: "Movie does not exist.",
      });
    }

    res.status(200).json({
      status: "success",
      data: movie,
    });
  } catch (error) {
    console.error("Error fetching movie:", error.message);

    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred while fetching the movie.",
    });
  }
});

const updateMovie = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.title = req.body.title.trim();
      req.body.title = req.body.title
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
    }

    req.body.detail = req.body.detail?.trim();

    const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedMovie) {
      return res.status(404).json({
        status: "fail",
        message: "Movie not Found",
      });
    }

    res.status(200).json({
      status: "success",
      data: updatedMovie,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
});

const movieReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { id } = req.params;

    // Input validation: Check if the rating is valid and the comment is not empty
    if (rating < 1 || rating > 5 || !comment.trim()) {
      return res.status(400).json({
        status: "fail",
        message:
          "Rating must be between 1 and 5, and the comment cannot be empty.",
      });
    }

    // Find the movie by its ID
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({
        status: "fail",
        message: "Movie not Found",
      });
    }

    // Check if the user has already reviewed the movie
    const alreadyReviewed = movie.reviews.find(
      (r) => r.user.toString() === req.User._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({
        status: "fail",
        message: "You have already reviewed this movie.",
      });
    }

    // Create the review object
    const review = {
      username: req.User.username,
      rating,
      comment: comment.trim(),
      user: req.User._id,
    };

    // Add the review to the movie's reviews array
    movie.reviews.push(review);

    // Save the updated movie
    const updatedMovie = await movie.save();

    // Respond with a success message and the updated movie
    res.status(201).json({
      status: "success",
      message: "Review added successfully!",
      data: updatedMovie,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred while adding the review.",
    });
  }
});

const deteleMovie = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) {
      return res.status(404).json({
        status: "fail",
        message: "Movie not Found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Movie deleted successfully",
      data: movie,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const { commentId } = req.body;
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({
        status: "fail",
        message: "Movie not Found",
      });
    }
    const comment = movie.reviews.findIndex(
      (r) => r._id.toString() === commentId.toString()
    );
    if (comment === -1) {
      return res.status(404).json({
        status: "fail",
        message: "Comment not Found",
      });
    }
    movie.reviews = movie.reviews.filter(
      (r) => r._id.toString() !== commentId.toString()
    );
    const updatedMovie = await movie.save();
    return res.status(200).json({
      status: "success",
      message: "Comment deleted successfully",
      data: updatedMovie,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
});

const getNewMovies = asyncHandler(async (req, res) => {
  try {
    const newMovies = await Movie.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    res.status(200).json({
      status: "success",
      data: newMovies,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getTopMovies = asyncHandler(async (req, res) => {
  try {
    const topRatedMovies = await Movie.find()
      .sort({ numReviews: -1 })
      .limit(10)
      .lean();
    res.status(200).json({
      status: "success",
      data: topRatedMovies,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getRandomMovies = asyncHandler(async (req, res) => {
  try {
    const randomMovies = await Movie.aggregate([
      { $sample: { size: 10 } },
    ]).lean();
    res.status(200).json({
      status: "success",
      data: randomMovies,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export {
  createMovie,
  getAllMovies,
  getSpecificMovie,
  updateMovie,
  movieReview,
  deteleMovie,
  deleteComment,
  getNewMovies,
  getTopMovies,
  getRandomMovies,
};
