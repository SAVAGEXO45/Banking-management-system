const Account = require("../models/Account");
const generateAccountNumber = require("../utils/generateAccountNumber");
const Transaction = require("../models/Transaction");
const generateTransactionReference = require("../utils/generateTransactionReference");
const mongoose = require("mongoose");

const createAccount = async (req, res) => {
    try {
        const { accountType } = req.body;


        if (!accountType) {
            return res.status(400).json({
                success: false,
                message: "Account type is required"
            });
        }


        if (!["savings", "current"].includes(accountType)) {
            return res.status(400).json({
                success: false,
                message: "Account type must be savings or current"
            });
        }


        let accountNumber;
        let accountExists = true;


        while (accountExists) {
            accountNumber = generateAccountNumber();


            accountExists = await Account.findOne({
                accountNumber
            });
        }


        const account = await Account.create({
            user: req.user.userId,
            accountNumber,
            accountType
        });


        res.status(201).json({
            success: true,
            message: "Bank account created successfully",
            data: {
                account: {
                    id: account._id,
                    accountNumber: account.accountNumber,
                    accountType: account.accountType,
                    balance: account.balance,
                    currency: account.currency,
                    status: account.status,
                    createdAt: account.createdAt
                }
            }
        });


    } catch (error) {
        console.error("Account creation error:", error.message);


        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};


const getMyAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({
            user: req.user.userId
        }).sort({ createdAt: -1 });


        res.status(200).json({
            success: true,
            message: "Accounts retrieved successfully",
            data: {
                accounts
            }
        });
    } catch (error) {
        console.error("Get accounts error:", error.message);


        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};


const getAccountById = async (req, res) => {
    try { 
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid account ID"
    });
}
        const account = await Account.findById(req.params.id);


        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }


        if (account.user.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this account"
            });
        }


        res.status(200).json({
            success: true,
            message: "Account retrieved successfully",
            data: {
                account
            }
        });
    } catch (error) {
        console.error("Get account error:", error.message);


        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};


const getAccountBalance = async (req, res) => {
    try { 
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid account ID"
    });
}
        const account = await Account.findById(req.params.id);


        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }


        if (account.user.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this account balance"
            });
        }


        res.status(200).json({
            success: true,
            message: "Account balance retrieved successfully",
            data: {
                accountNumber: account.accountNumber,
                balance: account.balance,
                currency: account.currency
            }
        });


    } catch (error) {
        console.error("Get account balance error:", error.message);


        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};


const depositMoney = async (req, res) => {
    try { 
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid account ID"
    });
}
        const { amount } = req.body;


        if (amount === undefined || amount === null) {
            return res.status(400).json({
                success: false,
                message: "Deposit amount is required"
            });
        }


        const depositAmount = Number(amount);


        if (isNaN(depositAmount) || depositAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Deposit amount must be greater than 0"
            });
        }


        const account = await Account.findById(req.params.id);


        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }


        if (account.user.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to deposit into this account"
            });
        }


        if (account.status !== "active") {
            return res.status(400).json({
                success: false,
                message: "This account is not active"
            });
        }


        account.balance += depositAmount;


        await account.save();


        await Transaction.create({
            account: account._id,
            user: req.user.userId,
            type: "deposit",
            amount: depositAmount,
            balanceAfter: account.balance,
            reference: generateTransactionReference(),
            description: "Account deposit",
            status: "successful"
        });




        res.status(200).json({
            success: true,
            message: "Deposit successful",
            data: {
                account: {
                    id: account._id,
                    accountNumber: account.accountNumber,
                    accountType: account.accountType,
                    balance: account.balance,
                    currency: account.currency,
                    status: account.status
                }
            }
        });


    } catch (error) {
        console.error("Deposit error:", error.message);


        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

const withdrawMoney = async (req, res) => {
    try { 
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid account ID"
    });
}
        const { amount } = req.body;


        if (amount === undefined || amount === null) {
            return res.status(400).json({
                success: false,
                message: "Withdrawal amount is required"
            });
        }


        const withdrawalAmount = Number(amount);


        if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Withdrawal amount must be greater than 0"
            });
        }


        const account = await Account.findById(req.params.id);


        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }


        if (account.user.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to withdraw from this account"
            });
        }


        if (account.status !== "active") {
            return res.status(400).json({
                success: false,
                message: "This account is not active"
            });
        }


        if (withdrawalAmount > account.balance) {
            return res.status(400).json({
                success: false,
                message: "Insufficient balance"
            });
        }


        account.balance -= withdrawalAmount;


        await account.save();


        await Transaction.create({
            account: account._id,
            user: req.user.userId,
            type: "withdrawal",
            amount: withdrawalAmount,
            balanceAfter: account.balance,
            reference: generateTransactionReference(),
            description: "Account withdrawal",
            status: "successful"
        });


        res.status(200).json({
            success: true,
            message: "Withdrawal successful",
            data: {
                account: {
                    id: account._id,
                    accountNumber: account.accountNumber,
                    accountType: account.accountType,
                    balance: account.balance,
                    currency: account.currency,
                    status: account.status
                }
            }
        });


    } catch (error) {
        console.error("Withdrawal error:", error.message);


        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};


const transferMoney = async (req, res) => {
    try { 
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid account ID"
    });
}
        const { recipientAccountNumber, amount } = req.body;


        if (!recipientAccountNumber || amount === undefined || amount === null) {
            return res.status(400).json({
                success: false,
                message: "Recipient account number and amount are required"
            });
        }


        const transferAmount = Number(amount);


        if (isNaN(transferAmount) || transferAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Transfer amount must be greater than 0"
            });
        }


        const senderAccount = await Account.findById(req.params.id);


        if (!senderAccount) {
            return res.status(404).json({
                success: false,
                message: "Sender account not found"
            });
        }


        if (senderAccount.user.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to transfer from this account"
            });
        }


        if (senderAccount.status !== "active") {
            return res.status(400).json({
                success: false,
                message: "Sender account is not active"
            });
        }

        if (!/^\d{10}$/.test(String(recipientAccountNumber))) {
            return res.status(400).json({
                success: false,
                message: "Recipient account number must be exactly 10 digits"
    });
}

        const recipientAccount = await Account.findOne({
            accountNumber: recipientAccountNumber
        });


        if (!recipientAccount) {
            return res.status(404).json({
                success: false,
                message: "Recipient account not found"
            });
        }


        if (senderAccount._id.toString() === recipientAccount._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot transfer money to the same account"
            });
        }


        if (recipientAccount.status !== "active") {
            return res.status(400).json({
                success: false,
                message: "Recipient account is not active"
            });
        }


        if (transferAmount > senderAccount.balance) {
            return res.status(400).json({
                success: false,
                message: "Insufficient balance"
            });
        }


        senderAccount.balance -= transferAmount;
        recipientAccount.balance += transferAmount;


        await senderAccount.save();
        await recipientAccount.save();


        await Transaction.create({
            account: senderAccount._id,
            user: req.user.userId,
            type: "transfer",
            amount: transferAmount,
            balanceAfter: senderAccount.balance,
            reference: generateTransactionReference(),
            description: `Transfer to ${recipientAccount.accountNumber}`,
            status: "successful"
        });


        await Transaction.create({
            account: recipientAccount._id,
            user: recipientAccount.user,
            type: "transfer",
            amount: transferAmount,
            balanceAfter: recipientAccount.balance,
            reference: generateTransactionReference(),
            description: `Transfer from ${senderAccount.accountNumber}`,
            status: "successful"
        });


        res.status(200).json({
            success: true,
            message: "Transfer successful",
            data: {
                transfer: {
                    from: senderAccount.accountNumber,
                    to: recipientAccount.accountNumber,
                    amount: transferAmount,
                    currency: senderAccount.currency,
                    balance: senderAccount.balance
                }
            }
        });


    } catch (error) {
        console.error("Transfer error:", error.message);


        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};


const getAllAccounts = async (req, res) => {
    try {
        const accounts = await Account.find()
            .populate("user", "firstName lastName email")
            .sort({ createdAt: -1 });


        res.status(200).json({
            success: true,
            message: "All accounts retrieved successfully",
            data: {
                accounts
            }
        });
    } catch (error) {
        console.error("Get all accounts error:", error.message);


        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};


const updateAccountStatus = async (req, res) => {
    try {
        const { status } = req.body;


        if (!["active", "frozen", "closed"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be either active, frozen, or closed"
            });
        }


        const account = await Account.findById(req.params.id);


        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }


        account.status = status;
        await account.save();


        res.status(200).json({
            success: true,
            message: `Account ${status === "active" ? "activated" : status === "frozen" ? "frozen" : "closed"} successfully`,
            data: {
                account: {
                    id: account._id,
                    accountNumber: account.accountNumber,
                    status: account.status
                }
            }
        });
    } catch (error) {
        console.error("Update account status error:", error.message);


        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};


module.exports = {
    createAccount,
    getMyAccounts,
    getAccountById,
    getAccountBalance,
    depositMoney,
    withdrawMoney,
    transferMoney,
    getAllAccounts,
    updateAccountStatus
};