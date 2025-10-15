const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validationResult } = require("express-validator");

// Generate JWT safely with fallback secret
const generateToken = (userId, role) => {
  const secret = process.env.JWT_SECRET || "dev_secret"; // fallback for dev
  return jwt.sign({ id: userId, role }, secret, { expiresIn: "1h" });
};

// REGISTER USER (public)
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) 
    return res.status(400).json({ message: "Invalid input", errors: errors.array() });

  try {
    const { email, password, role } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({ email, password, role: role || "reader" });
    const token = generateToken(user._id, user.role);

    return res.status(201).json({ id: user._id, email: user.email, role: user.role, token });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: `Server Error: ${e.message}` });
  }
};

// LOGIN USER (public)
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) 
    return res.status(400).json({ message: "Invalid input", errors: errors.array() });

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) 
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user._id, user.role);
    return res.json({ token, user: { id: user._id, role: user.role } });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e.message });
  }
};

// ADMIN CREATE USER (admin only)
exports.adminCreateUser = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const user = await User.create({ email, password, role: role || "reader" });
    return res.status(201).json({ user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
};

// TEMP: Seed an admin (dev only)
exports.seedAdmin = async (req, res) => {
  try {
    const user = await User.create({ email: "admin@gmail.com", password: "admin123", role: "admin" });
    res.json({ message: "Admin created", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating admin" });
  }
};