const express = require("express");
const { register, login, logout } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const { loginLimiter } = require("../middleware/rateLimitMiddleware");


const router = express.Router();


router.post("/register", register);
router.post("/login", loginLimiter, login);
router.post("/logout", protect, logout);


router.get("/protected-test", protect, (req, res) => {
    res.status(200).json({
        success: true,
        message: "You accessed a protected route",
        user: req.user
    });
});


module.exports = router;