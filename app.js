const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const adminRoutes = require ("./routes/adminRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const helmet = require("helmet");
const cors = require("cors");

dotenv.config();


const app = express();
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));


const PORT = process.env.PORT || 5000;


connectDB();


app.use(express.json());


app.get('/', (req, res) => {
    res.json({ 
       success: true,
       message: 'Banking Management System API is running' 
    });
});


app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/admin", adminRoutes);
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});