import mongoose from "mongoose";

// user Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minLength: [3, "Username must be at least 3 characters long"],
      maxLength: [30, "Username must not exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be at least 8 characters long"],
      select: false, // Excludes password field in queries by default
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

// Static Method: Search by email with case-insensitivity
userSchema.statics.findByEmail = async function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Virtual Field: Display user role
userSchema.virtual("role").get(function () {
  return this.isAdmin ? "Admin" : "User";
});

// Indexing: Add an index for efficient email lookups
userSchema.index({ email: 1 });

// User Model
const User = mongoose.model("User", userSchema);

// Export
export default User;
