const axios = require('axios');
const Price = require('../models/Price');

// Controller function to fetch and store Ethereum price
const fetchAndStorePrice = async () => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'ethereum',
        vs_currencies: 'inr'
      }
    });

    const ethPriceInINR = response.data.ethereum.inr;

    const price = new Price({
      currency: 'INR',
      value: ethPriceInINR
    });

    await price.save();

    console.log(`Ethereum price of INR ${ethPriceInINR} stored in the database.`);
  } catch (error) {
    console.error('Error fetching or storing Ethereum price:', error.message);
  }
};

module.exports = { fetchAndStorePrice };
