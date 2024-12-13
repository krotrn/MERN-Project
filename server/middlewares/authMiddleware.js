import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "./asyncHandler.js";

// check if user is authenticated or not
const authenticate = asyncHandler(async (req, res, next) => {
  // Read JWT from the 'jwt' cookie
  const token = req.cookies.jwt;

  if (token) {
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find the user by id from the decoded token and attach it to req.User, excluding password
      req.User = await User.findById(decoded.userId).select("-password");

      // Call the next middleware
      next();
    } catch (error) {
      // If the token is invalid
      res.status(401);
      throw new Error("Not authorized, token verification failed.");
    }
  } else {
    // If no token is found
    res.status(401);
    throw new Error("Not authorized, no token found. Please log in.");
  }
});

// check if user is an admin or not
const authorizeAdmin = (req, res, next) => {
    if (req.User && req.User.isAdmin) {
    next();
  } else {
    res.status(403) // Use 403 for forbidden access
    .json({message : "Not authorized, you must be an admin."});
  }
};

// Export
export { authenticate, authorizeAdmin };
