const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");

const getMyTransactions = async (req, res) => {
    try {
        const { type, accountId, page = 1, limit = 10 } = req.query;


        const filter = {
            user: req.user.userId
        };


        if (type) {
            if (!["deposit", "withdrawal", "transfer"].includes(type)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid transaction type"
                });
            }


            filter.type = type;
        }


        
    if (accountId) {
        if (!mongoose.Types.ObjectId.isValid(accountId)) {
            return res.status(400).json({
               success: false,
               message: "Invalid account ID"
            });
        }

        filter.account = accountId;
    }



        const pageNumber = Number(page);
        const limitNumber = Number(limit);


        if (
            !Number.isInteger(pageNumber) ||
            pageNumber < 1
        ) {
            return res.status(400).json({
                success: false,
                message: "Page must be a positive number"
            });
        }


        if (
            !Number.isInteger(limitNumber) ||
            limitNumber < 1 ||
            limitNumber > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Limit must be between 1 and 100"
            });
        }


        const skip = (pageNumber - 1) * limitNumber;


        const transactions = await Transaction.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber)
            .populate("account", "accountNumber accountType");


        const totalTransactions = await Transaction.countDocuments(filter);


        const totalPages = Math.ceil(totalTransactions / limitNumber);


        res.status(200).json({
            success: true,
            message: "Transactions retrieved successfully",
            data: {
                transactions,
                pagination: {
                    currentPage: pageNumber,
                    limit: limitNumber,
                    totalTransactions,
                    totalPages
                }
            }
        });


    } catch (error) {
        console.error("Get transactions error:", error.message);


        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};


module.exports = {
    getMyTransactions
};