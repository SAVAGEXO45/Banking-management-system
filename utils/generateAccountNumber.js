const generateAccountNumber = () => {
    let accountNumber = "";

    for (let i = 0; i < 10; i++) {
        accountNumber += Math.floor(Math.random() * 10);
    }

    return accountNumber;
};

module.exports = generateAccountNumber;