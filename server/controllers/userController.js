import User from "../models/User.js";
import bcrypt from "bcryptjs"; // Import bcrypt to hash passwords
import asyncHandler from "../middlewares/asyncHandler.js"; // Import the asyncHandler middleware
import generateToken from "../utils/createToken.js"; // Import the function to generate JWT token
import {
    validateEmail,
    validatePasswordStrength,
} from "../utils/validators.js"; // Import the email and password validators

// Create a new user
const createUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Validation: Check for missing fields
    if (!username || !email || !password) {
        res.status(422);
        return res.json({
            message: "Missing required fields: username, email, or password.",
        });
    }

    // Validation: Check for valid email format
    if (!validateEmail(email.toLowerCase())) {
        res.status(422);
        return res.json({ message: "Invalid email format." });
    }

    // Validation: Check password strength
    if (!validatePasswordStrength(password)) {
        res.status(422);
        return res.json({
            message:
                "Password must be at least 8 characters long, and contain numbers and special characters.",
        });
    }

    // Check if the user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
        res.status(409); // Conflict
        return res.json({ message: "User already exists with this email." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const newUser = new User({
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
    });

    try {
        await newUser.save(); // Save the user to the database
        generateToken(res, newUser._id); // Generate and set token

        res.status(201).json({
            status: "success",
            data: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                isAdmin: newUser.isAdmin,
            },
        });
    } catch (error) {
        throw new Error("Failed to create the user. Please try again.");
    }
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (!existingUser) {
        res.status(404) // Not Found
            .json({ message: "Invalid Credentials" });
        return;
    }

    const isPasswordMatched = await bcrypt.compare(
        password,
        existingUser.password
    );
    if (!isPasswordMatched) {
        res.status(401) // Unauthorized
            .json({ message: "Invalid Credentials" });
        return;
    }

    // Generate and set token
    generateToken(res, existingUser._id);

    res.status(200)
        .json({
        status: "success",
        data: {
            _id: existingUser._id,
            username: existingUser.username,
            email: existingUser.email,
            isAdmin: existingUser.isAdmin,
        },
    });
});

// Logout user
const logCurrentUserOut = asyncHandler(async (req, res) => {
    try {
        res.cookie("jwt", null, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "Strict",
            expires: new Date(0), // immediately expire the cookie
        });

        res.status(200).json({
            status: "success",
            message: "Logged out successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to log out. Please try again later.",
        });
    }
});

// getAllUser
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.status(200).json({
            status: "success",
            data: users,
        });
    } catch (error) {
        res.status(500);
        throw new Error("Failed to fetch users. Please try again later.");
    }
});

// Profile
const getCurrentUserProfile = asyncHandler(async (req, res) => {
    try {
        const user = await User.find(req.User._id);
        res.status(200).json({
            _id: user[0]._id,
            username: user[0].username,
            email: user[0].email,
        });
    } catch (error) {
        res.status(500);
        throw new Error("Failed to fetch User");
    }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
    try {
        // Find the user
        const user = await User.findById(req.User._id);
        if (!user) {
            return res
                .status(404)
                .json({
                    message:
                        "User not found. Please check if the user ID is correct.",
                });
        }

        // Update the username if provided
        user.username = req.body.username || user.username;

        // Handle email update if provided
        if (req.body.email) {
            const newEmail = req.body.email.toLowerCase();

            // Validate email format
            if (!validateEmail(newEmail)) {
                return res
                    .status(422)
                    .json({
                        message:
                            "Invalid email format. Please provide a valid email address.",
                    });
            }

            // Check if email is already taken by another user
            const userExists = await User.findOne({ email: newEmail });
            if (
                userExists &&
                userExists._id.toString() !== user._id.toString()
            ) {
                return res.status(409).json({
                    message: `The email ${newEmail} is already associated with another account. Please use a different email.`,
                });
            }

            // Update the email
            user.email = newEmail;
        }

        // Handle password update if provided
        if (req.body.password) {
            // Validate password strength
            if (!validatePasswordStrength(req.body.password)) {
                return res.status(422).json({
                    message:
                        "Weak password. Password must be at least 8 characters long and include numbers and special characters.",
                });
            }

            // Hash the new password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        // Save the updated user in the database
        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } catch (error) {
        res.status(500).json({
            message: `Error updating user profile: ${error.message}`,
        });
    }
});

// Export
export {
    createUser,
    loginUser,
    logCurrentUserOut,
    getAllUsers,
    getCurrentUserProfile,
    updateCurrentUserProfile,
};
