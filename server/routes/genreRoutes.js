import express from "express";

const router = express.Router();

// controllers
import { createGenre, deleteGenre, getAllGenres } from "../controllers/genreController.js";


// Middlewares
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

router
  .route("/")
  .post(authenticate, authorizeAdmin, createGenre)
  .delete(authenticate, authorizeAdmin, deleteGenre)
  .get(authenticate, getAllGenres);


export default router;