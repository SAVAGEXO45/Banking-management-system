const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        accountNumber: {
            type: String,
            required: true,
            unique: true
        },

        accountType: {
            type: String,
            enum: ["savings", "current"],
            required: true
        },

        balance: {
            type: Number,
            default: 0,
            min: 0
        },

        currency: {
            type: String,
            default: "NGN"
        },

        status: {
            type: String,
            enum: ["active", "frozen", "closed"],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;