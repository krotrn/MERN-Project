import User from "../models/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler.js";
import generateToken from "../utils/createToken.js";
import {
  validateEmail,
  validatePasswordStrength,
} from "../utils/validators.js";

// Create a new user
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(422).json({
      status: "error",
      message: "Missing required fields: username, email, or password.",
    });
  }

  if (!validateEmail(email.toLowerCase())) {
    return res.status(422).json({
      status: "error",
      message: "Invalid email format.",
    });
  }

  if (!validatePasswordStrength(password)) {
    return res.status(422).json({
      status: "error",
      message:
        "Password must be at least 8 characters long and contain numbers and special characters.",
    });
  }

  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    return res.status(409).json({
      status: "error",
      message: "User already exists with this email.",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    email: email.toLowerCase(),
    password: hashedPassword,
  });

  try {
    await newUser.save();
    generateToken(res, newUser._id);

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
    res.status(500).json({
      status: "error",
      message: "Failed to create the user. Please try again.",
    });
  }
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({
      status: "error",
      message: "Missing required fields: email or password.",
    });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() }).lean();
  if (!existingUser) {
    return res.status(404).json({
      status: "error",
      message: "Invalid credentials.",
    });
  }

  const isPasswordMatched = await bcrypt.compare(
    password,
    existingUser.password
  );
  if (!isPasswordMatched) {
    return res.status(401).json({
      status: "error",
      message: "Invalid credentials.",
    });
  }

  generateToken(res, existingUser._id);

  res.status(200).json({
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
  res.cookie("jwt", null, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "Strict",
    expires: new Date(0),
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully.",
  });
});

// Get all users (Admin only)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password").lean();
  res.status(200).json({
    status: "success",
    data: users,
  });
});

// Get current user profile
const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.User._id).select("-password").lean();

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found.",
    });
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
});

// Update current user profile
const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.User._id);

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found.",
    });
  }

  user.username = req.body.username || user.username;

  if (req.body.email) {
    const newEmail = req.body.email.toLowerCase();

    if (!validateEmail(newEmail)) {
      return res.status(422).json({
        status: "error",
        message: "Invalid email format.",
      });
    }

    const emailTaken = await User.findOne({ email: newEmail });
    if (emailTaken && emailTaken._id.toString() !== user._id.toString()) {
      return res.status(409).json({
        status: "error",
        message: "Email is already associated with another account.",
      });
    }

    user.email = newEmail;
  }

  if (req.body.password) {
    if (!validatePasswordStrength(req.body.password)) {
      return res.status(422).json({
        status: "error",
        message:
          "Password must be at least 8 characters long and contain numbers and special characters.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }

  try {
    const updatedUser = await user.save();

    res.status(200).json({
      status: "success",
      data: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Failed to update user: ${error.message}`,
    });
  }
});

export {
  createUser,
  loginUser,
  logCurrentUserOut,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
};
