import express from "express";
import "dotenv/config";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    // Extract token from Authorization header in "Bearer <token>" format
    const authHeader = req.headers.authorization || req.headers.token;

    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    // If token is in "Bearer <token>" form, split it to get only the token
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }

    // Verify token using secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by decoded id from token, excluding password
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Attach user to req object for downstream middleware/routes
    req.user = user;
    next();
  } catch (error) {
    console.error(error.message);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};
