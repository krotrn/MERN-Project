import path from "path";
import fs from "fs";
import express from "express";
import multer from "multer";

const router = express.Router();

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files to the uploads directory
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${Date.now()}${extname}`); // e.g., image-1234567890.jpg
  },
});

// File filter for image validation
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpe?g|png|webp/;
  const isFileTypeValid = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const isMimeTypeValid = allowedFileTypes.test(file.mimetype);

  if (isFileTypeValid && isMimeTypeValid) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WebP images are allowed."));
  }
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Route for single image upload
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: "fail",
      message: "No image uploaded. Please provide a valid image.",
    });
  }

  // Send a success response with the file path
  res.status(200).json({
    status: "success",
    message: "Image uploaded successfully.",
    imagePath: `/uploads/${req.file.filename}`,
  });
});

// Error handling middleware for upload errors
router.use((err, req, res, next) => {
  console.error("Upload Error:", err.message);

  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        status: "fail",
        message: "File size exceeds the 2MB limit.",
      });
    }
    return res.status(400).json({
      status: "fail",
      message: "Multer error occurred during file upload.",
    });
  }

  // General errors
  res.status(500).json({
    status: "error",
    message: err.message || "An unexpected error occurred during file upload.",
  });
});

export default router;
