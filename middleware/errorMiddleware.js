
const errorHandler = (err, req, res, next) => {
    console.error("Server error:", err.message);

    if (res.headersSent) {
        return next(err);
    }

    res.status(err.statusCode || 500).json({
        success: false,
        message:
            err.statusCode && err.statusCode < 500
                ? err.message
                : "Something went wrong"
    });
};

module.exports = errorHandler;
