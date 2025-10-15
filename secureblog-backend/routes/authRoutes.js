const express = require("express");
// const {register, login} = require("../controllers/authController");
const authController = require("../controllers/authController");
const {registerRules, loginRules} = require("../src/utils/validators");
// const rateLimit = require("express-rate-limit")
const router = express.Router();
const {registerLimiter, loginLimiter, emailLimiter, banner, bannerEmail} = require("../middleware/rateLimiter");

//Brute force limiter for login - Added  --> securing login --> 3) Wiring validators intoroutes
// const loginLimiter = rateLimit({windowsMS: 10 * 60 * 1000, max: 20});

// router.post("/register", register);
// router.post("/login", login);

//adjusted --> securing login --> 3) Wiring validators intoroutes
router.post("/register", registerLimiter,registerRules, authController.register);
router.post("/login", loginLimiter, banner, bannerEmail, emailLimiter ,loginRules, authController.login );

///admin create user
router.post("/create-user", authController.adminCreateUser);

//temp added == seeding admin
// router.post("/seed-admin", authController.seedAdmin);


module.exports = router;