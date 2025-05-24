import bcrypt from "bcrypt";
import { User } from "../models/User.model.js";
import express from "express";
import validator from "validator";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ message: "Email must be in correct format" });
    }

    if (!validator.isStrongPassword(password)) {
      return res
        .status(400)
        .json({ message: "Please enter a stronger password" });
    }

    const existingUser = await User.findOne({ email });
    const existUserName = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }
    if (existUserName) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "Account successfully created", success: true });
  } catch (error) {
    console.error(error); // log for debugging
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
