const Transaction = require('../models/Transaction');
const Price = require('../models/Price');

// Function to calculate total expenses for a given address
const calculateTotalExpenses = async (address) => {
  try {
    // Fetch all transactions for the given address
    const transactions = await Transaction.find({ to: address });

    // Calculate total expenses in Ether
    let totalExpenses = 0;
    transactions.forEach(transaction => {
      const gasUsed = parseInt(transaction.gasUsed);
      const gasPrice = parseInt(transaction.gasPrice);
      const expense = (gasUsed * gasPrice) / 1e18; // Convert Wei to Ether
      totalExpenses += expense;
    });

    return totalExpenses;
  } catch (error) {
    logger.error('Error calculating total expenses', error);
    throw new Error('Error calculating total expenses');
  }
};

// Function to fetch the most recent Ethereum price in INR
const getCurrentEthPrice = async () => {
  try {
    const latestPrice = await Price.findOne().sort({ createdAt: -1 });
    return latestPrice ? latestPrice.value : null;
  } catch (error) {
    logger.error('Error fetching current Ethereum price', error);
    throw new Error('Error fetching current Ethereum price');
  }
};

// Controller function for the GET API
const getUserExpensesAndPrice = async (req, res) => {
  const { address } = req.params;

  try {
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    // Calculate total expenses
    const totalExpenses = await calculateTotalExpenses(address);

    // Fetch the current Ethereum price
    const currentPrice = await getCurrentEthPrice();

    res.status(200).json({
      address,
      totalExpensesInEther: totalExpenses,
      currentPriceInINR: currentPrice
    });
  } catch (error) {
    logger.error(`Error in getUserExpensesAndPrice: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getUserExpensesAndPrice
};
