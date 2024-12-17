import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Review Schema
const reviewSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      maxlength: [100, "Name must not exceed 100 characters"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
      maxlength: [500, "Comment must not exceed 500 characters"],
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Movie Schema
const movieSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Movie title is required"],
      trim: true,
      unique: true,
      maxlength: [200, "Movie title must not exceed 200 characters"],
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/300x450?text=No+Image", // Fallback image
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [1900, "Year must be later than 1900"],
      max: [new Date().getFullYear(), "Year cannot be in the future"],
    },
    genre: {
      type: Schema.Types.ObjectId,
      ref: "Genre",
      required: [true, "Genre is required"],
    },
    detail: {
      type: String,
      required: [true, "Movie details are required"],
      trim: true,
      maxlength: [2000, "Details must not exceed 2000 characters"],
    },
    cast: [
      {
        type: String,
        trim: true,
        maxlength: [100, "Cast member names must not exceed 100 characters"],
      },
    ],
    reviews: [reviewSchema],
    createdAt: {
      type: Date,
      default: new Date().toISOString(),
    },
    updatedAt: {
      type: Date,
      default: new Date().toISOString(),
    }
  },
  { timestamps: true }
);

// Virtual field for number of reviews
movieSchema.virtual("numReview").get(function () {
  return this.reviews.length;
});

// Virtual field for average rating
movieSchema.virtual("rating").get(function () {
  // Check if there are reviews
  if (this.reviews.length === 0) {
    return 0;  // Return 0 or a default value if there are no reviews
  }

  // Calculate the average rating
  const totalRating = this.reviews.reduce((acc, item) => item.rating + acc, 0);
  return totalRating / this.reviews.length;
});

movieSchema.virtual("fetchedAt").get(function () {
  return new Date().toISOString();
});



// Middleware to auto-update fields (if needed)
movieSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    this.title = this.title
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
  next();
});

// Indexing for better query performance
movieSchema.index({ title: "text", genre: 1 });

const Movie = model("Movie", movieSchema);

export default Movie;
