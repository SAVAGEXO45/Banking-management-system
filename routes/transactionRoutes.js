const express = require("express");

const {
    getMyTransactions
} = require("../controllers/transactionController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getMyTransactions);

module.exports = router;