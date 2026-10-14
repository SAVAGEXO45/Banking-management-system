const express = require("express");

const {
    getMyProfile,
    updateMyProfile,
    changePassword
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", protect, getMyProfile);

router.put("/profile", protect, updateMyProfile);

router.put("/change-password", protect, changePassword);

module.exports = router;