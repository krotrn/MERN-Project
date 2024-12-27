import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expiration time
  });

  res.cookie("jwt", token, {
    httpOnly: true, // Prevent client-side JavaScript access
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "none", // Required for cross-origin requests
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};

export default generateToken;
