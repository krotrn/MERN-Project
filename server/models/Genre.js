import mongoose from "mongoose";



const genreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxLength: 32,
      unique: true,
      match: /^[a-zA-Z0-9\s]+$/,
    },    
  },
  { timestamps: true }
);



export default mongoose.model("Genre", genreSchema);
