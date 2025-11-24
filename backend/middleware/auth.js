import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Handle "Bearer tokenHere"
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = { id: decoded.id };  // FIXED

    next();
  } catch (error) {
    console.log("Auth Error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default auth;
