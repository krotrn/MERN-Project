import express from "express";
import {
    createUser,
    loginUser,
    logCurrentUserOut,
    getAllUsers,
    getCurrentUserProfile,
    updateCurrentUserProfile
} from "../controllers/userController.js";

// middlewares
import { validateRequiredFields } from "../middlewares/validateFields.js";

// import { rateLimit } from "../middlewares/rateLimits.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to create a new user (registration)
router
    .route("/register")
    .post(
        validateRequiredFields(["username", "email", "password"]),
        createUser
    )
    .get(authenticate, authorizeAdmin, getAllUsers);

// Route to login a user (authentication)
router
    .post(
    "/login",
    // rateLimit,
    validateRequiredFields(["email", "password"]),
    loginUser
);

router
    .post("/logout", logCurrentUserOut);

router
    .route('/profile')
    .get(authenticate, getCurrentUserProfile)
    .put(authenticate, updateCurrentUserProfile);

export default router;
