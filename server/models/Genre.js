import mongoose from "mongoose";

const { Schema, model } = mongoose;

const genreSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Genre name is required"],
      trim: true,
      unique: true,
      maxLength: [50, "Genre name must not exceed 50 characters"], // Increased max length for flexibility
      match: [/^[a-zA-Z0-9\s]+$/, "Genre name must contain only letters, numbers, and spaces"],
    },
    description: {
      type: String,
      trim: true,
      maxLength: [200, "Description must not exceed 200 characters"], // Optional description field
      default: "No description provided.",
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically set creation timestamp
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

// Middleware: Ensure `name` is saved in lowercase
genreSchema.pre("save", function (next) {
  this.name = this.name
  .split(" ")
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");
  next();
});



export default model("Genre", genreSchema);
