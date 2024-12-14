import express from "express";

const router = express.Router();

// controllers
import {
  createGenre,
  deleteGenre,
  getAllGenres,
  updateGenre,
  readGenre,
} from "../controllers/genreController.js";

// Middlewares
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

router
  .route("/")
  .post(authenticate, authorizeAdmin, createGenre)
  .get(authenticate, getAllGenres);

router
  .route("/:id")
  .delete(authenticate, authorizeAdmin, deleteGenre)
  .put(authenticate, authorizeAdmin, updateGenre)
  .get(readGenre);

export default router;
