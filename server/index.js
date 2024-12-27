import express from "express";
import cookieParser from "cookie-parser"; // for parsing cookies
import dotenv from "dotenv"; // for environment variables
import cors from "cors"; // for cross-origin requests
import morgan from "morgan"; // for logging
import helmet from "helmet"; // for security
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit"; // for rate limiting

// files

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import uploadRoutes from "./routes/uploadRoute.js";

// configuration of environment variables
dotenv.config();

// connect to database
connectDB();

// create express app
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT;

// middlewares
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded data (form data)
app.use(express.json()); // for parsing application/json
app.use(cookieParser()); // for parsing cookies

app.use(rateLimit);

app.use(
  cors({
    origin: ["https://mern-kr.vercel.app/"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(morgan("dev")); // for logging
app.use(helmet()); // for security

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "An unexpected error occurred.",
  });
});

// routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/genres", genreRoutes);
app.use("/api/v1/movies", movieRoutes);
app.use("/api/v1/uploads", uploadRoutes);

// lisen to port
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
