const express = require('express');
const { getTransactions } = require('../../controllers/transactionsController.js');
const { getUserExpensesAndPrice } = require('../../controllers/expenseController.js');

const router = express.Router();

// Route to get transactions of a user
router.get('/:address', getTransactions);

// Route to get user expenses and current price of Ethereum
router.get('/:address/expenses', getUserExpensesAndPrice);

module.exports = router;
