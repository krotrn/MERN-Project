import express from "express";

const router = express.Router();

// controllers
import {
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
} from "../controllers/movieController.js";

// middlewares
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

// public Routes
router.route("/all-movies").get(getAllMovies);
router.route("/:id").get(checkId, getSpecificMovie);
router.route("/new-movies").get(getNewMovies);
router.route("/top-movies").get(getTopMovies);
router.route("/random-movies").get(getRandomMovies);
// restricted Routes
router.route("/:id/reviews").post(authenticate, checkId, movieReview);

//Admin Routes
router.route("/create-movie").post(authenticate, authorizeAdmin, createMovie);
router
  .route("/update-movie/:id")
  .put(authenticate, authorizeAdmin, checkId, updateMovie);
router
  .route("/delete-movie/:id")
  .delete(authenticate, authorizeAdmin, checkId, deteleMovie);
router
  .route("/delete-comment/:id")
  .delete(authenticate, authorizeAdmin, checkId, deleteComment);

export default router;
