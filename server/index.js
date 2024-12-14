import express from "express";
import cookieParser from "cookie-parser"; // for parsing cookies
import dotenv from "dotenv"; // for environment variables
import cors from "cors"; // for cross-origin requests
import morgan from "morgan"; // for logging
import helmet from "helmet"; // for security

// files

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import genreRoutes from "./routes/genreRoutes.js"

// configuration of environment variables
dotenv.config();

// connect to database
connectDB();

// create express app
const app = express();

// middlewares
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded data (form data)
app.use(express.json()); // for parsing application/json
app.use(cookieParser()); // for parsing cookies
app.use(cors()); // for cross-origin requests
app.use(morgan("dev")); // for logging
app.use(helmet()); // for security

const PORT = process.env.PORT || 3000;

// routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/genres", genreRoutes);

// lisen to port
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
