const generateTransactionReference = () => {
    return `TXN-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
};

module.exports = generateTransactionReference;