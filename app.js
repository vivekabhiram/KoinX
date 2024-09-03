const express = require('express');
const connectDB = require('./config/db');
const transactionsRoute = require('./server/routes/transactions.js');
const { fetchAndStorePrice } = require('./controllers/priceController');
const cron = require('node-cron');
//const expressLayout = require('expres-ejs-layouts');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

//Templating engine
//app.use(expressLayout)
//app.set('layout', './layouts/main');
//app.set('view engine', 'ejs');

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// Routes
//app.use()

app.use('/api/transactions', transactionsRoute);

// Schedule a job to fetch Ethereum price every 10 minutes
cron.schedule('*/10 * * * *', () => {
  logger.info('Fetching Ethereum price...');
  fetchAndStorePrice();
});


app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

