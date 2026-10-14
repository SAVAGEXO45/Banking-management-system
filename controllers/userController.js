const User = require("../models/User");
const bcrypt = require("bcryptjs");


const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        res.status(200).json({
            success: true,
            message: "Profile retrieved successfully",
            data: {
                user
            }
        });
    } catch (error) {
        console.error("Get profile error:", error.message);


        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};


const updateMyProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone, address } = req.body;


        const user = await User.findById(req.user.userId);


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        if (firstName !== undefined) {
            user.firstName = firstName;
        }


        if (lastName !== undefined) {
            user.lastName = lastName;
        }


        if (phone !== undefined) {
            user.phone = phone;
        }


        if (address !== undefined) {
            user.address = address;
        }


        await user.save();


        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    role: user.role
                }
            }
        });
    } catch (error) {
        console.error("Update profile error:", error.message);


        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;


        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required"
            });
        }


        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters"
            });
        }


        const user = await User.findById(req.user.userId);


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            user.password
        );


        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }


        const hashedPassword = await bcrypt.hash(newPassword, 10);


        // Save new password
        user.password = hashedPassword;


        await user.save();


        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        console.error("Change password error:", error.message);


        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: {
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
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: {
                user
            }
        });
    } catch (error) {
        console.error("Get user error:", error.message);

        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

module.exports = {
    getMyProfile,
    updateMyProfile,
    changePassword,
    getAllUsers,
    getUserById
};