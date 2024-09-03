const axios = require('axios');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const logger = require('../utils/logger');

// Controller function to fetch and store transactions
exports.getTransactions = async (req, res) => {
  const address = req.params.address;

  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return res.status(400).json({ error: 'Invalid Ethereum address' });
  }

  try {
    // Fetch transactions from Etherscan
    const response = await axios.get(`https://api.etherscan.io/api`, {
      params: {
        module: 'account',
        action: 'txlist',
        address: address,
        startblock: 0,
        endblock: 99999999,
        page: 1,
        offset: 10,
        sort: 'asc',
        apikey: process.env.ETHERSCAN_API_KEY,
      },
    });

    const transactions = response.data.result;

    // Check if user exists
    let user = await User.findOne({ address });

    if (!user) {
      user = new User({ address });
      await user.save();
    }

    // Save transactions to MongoDB
    const transactionPromises = transactions.map(transaction => {
      const newTransaction = new Transaction({
        userAddress: address,
        blockNumber: transaction.blockNumber,
        timeStamp: transaction.timeStamp,
        hash: transaction.hash,
        nonce: transaction.nonce,
        blockHash: transaction.blockHash,
        transactionIndex: transaction.transactionIndex,
        from: transaction.from,
        to: transaction.to,
        value: transaction.value,
        gas: transaction.gas,
        gasPrice: transaction.gasPrice,
        isError: transaction.isError,
        txreceipt_status: transaction.txreceipt_status,
        input: transaction.input,
        contractAddress: transaction.contractAddress,
        cumulativeGasUsed: transaction.cumulativeGasUsed,
        gasUsed: transaction.gasUsed,
        confirmations: transaction.confirmations,
        methodId: transaction.methodId,
        functionName: transaction.functionName,
      });

      return newTransaction.save();
    });

    await Promise.all(transactionPromises);

    res.status(200).json(transactions);
  } catch (err) {
    logger.error(`Error fetching transactions: ${err.message}`);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};
