const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Security middlewares
app.use(
   helmet())//.contentSecurityPolicy({
  //     directives: {
  //     defaultSrc: ["'self'"],
  //     scriptSrc: ["'self'", "https://apis.google.com"],
  //     styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  //     fontSrc: ["'self'", "https://fonts.gstatic.com"],
  //     imgSrc: ["'self'", "data:"],
  //     connectSrc: ["'self'", "https://localhost:5000"], // or whichever port you use
  //     },
  // })
  // );
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json()); // Parse JSON bodies

// Routes
const authRoutes = require("./routes/authRoutes");
const { protect } = require("./middleware/authMiddleware");

app.use("/api/auth", authRoutes);

// Example protected route
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: `Welcome, user ${req.user.id}!`,
    timestamp: new Date()
  });
});

const { errorHandler } = require("./middleware/errorHandler");
app.use(errorHandler);

module.exports = app;