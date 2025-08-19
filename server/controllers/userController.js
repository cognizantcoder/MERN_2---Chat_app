//sign up a new user

import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

// SIGNUP
export const signup = async (req, res) => {
  const { email, fullName, password, bio } = req.body;
  try {
    if (!email || !fullName || !password || !bio) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "Account already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      fullName,
      password: hashed,
      bio,
    });

    const token = generateToken(newUser._id);
    // Exclude password in response
    const { password: pwd, ...userSafeData } = newUser._doc;

    res.status(201).json({
      success: true,
      userData: userSafeData,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//controller for user login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);

    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(userData._id);
    res.json({
      success: true,
      userData,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.json({ success: false, message: "Internal server error" });
  }
};

//controller to check if user is authenticated
export const checkAuth = (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

//controller  to update user profile

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, bio, profilePic } = req.body;
    const userId = req.user._id;
    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          fullName,
          bio,
        },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);

      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, fullName, bio },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Image upload failed" });
  }
};
