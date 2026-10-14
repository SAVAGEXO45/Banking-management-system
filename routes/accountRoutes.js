const express = require("express");


const {
    createAccount,
    getMyAccounts,
    getAccountById,
    getAccountBalance,
    depositMoney,
    withdrawMoney,
    transferMoney
} = require("../controllers/accountController");


const protect = require("../middleware/authMiddleware");


const router = express.Router();


router.post("/", protect, createAccount);


router.get("/", protect, getMyAccounts);


router.get("/:id", protect, getAccountById);


router.get("/:id/balance", protect, getAccountBalance);


router.post("/:id/deposit", protect, depositMoney);


router.post("/:id/withdraw", protect, withdrawMoney);


router.post("/:id/transfer", protect, transferMoney);


module.exports = router;