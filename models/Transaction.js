const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        account: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        type: {
            type: String,
            enum: ["deposit", "withdrawal", "transfer"],
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        balanceAfter: {
            type: Number,
            required: true,
            min: 0
        },

        reference: {
            type: String,
            required: true,
            unique: true
        },

        description: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: ["successful", "failed"],
            default: "successful"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Transaction", transactionSchema);