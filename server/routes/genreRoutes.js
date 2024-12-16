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
import checkId from "../middlewares/checkId.js";

router
  .route("/")
  .post(authenticate, authorizeAdmin, createGenre)
  .get(authenticate, getAllGenres);

router
  .route("/:id")
  .delete(checkId,authenticate, authorizeAdmin, deleteGenre)
  .put(checkId, authenticate, authorizeAdmin, updateGenre)
  .get(checkId, readGenre);

export default router;
