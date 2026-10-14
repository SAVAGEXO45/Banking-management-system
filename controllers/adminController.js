
const User = require("../models/User");
const Transaction = require("../models/Transaction");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: {
                totalUsers: users.length,
                users
            }
        });

    } catch (error) {
        console.error("Get all users error:", error.message);

        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};


const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate("user", "name email")
            .populate("account", "accountNumber accountType")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "All transactions retrieved successfully",
            data: {
                totalTransactions: transactions.length,
                transactions
            }
        });

    } catch (error) {
        console.error("Get all transactions error:", error.message);

        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

module.exports = {
    getAllUsers,
    getAllTransactions
};
