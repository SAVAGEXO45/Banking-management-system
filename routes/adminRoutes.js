const express = require("express");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const { getAllUsers } = require("../controllers/userController");
const { getUserById } = require("../controllers/userController");
const { getAllAccounts } = require("../controllers/accountController");
const { updateAccountStatus } = require("../controllers/accountController");
const { getAllTransactions } = require("../controllers/adminController");

const router = express.Router();

router.get("/dashboard", protect, adminOnly, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the admin dashboard",
        data: {
            adminId: req.user.userId,
            role: req.user.role
        }
    });
});

router.get("/users", protect, adminOnly, getAllUsers);
router.get("/users/:id", protect, adminOnly, getUserById);
router.get("/accounts", protect, adminOnly, getAllAccounts);
router.put("/accounts/:id/status", protect, adminOnly, updateAccountStatus);
router.get("/transactions", protect, adminOnly, getAllTransactions);

module.exports = router;