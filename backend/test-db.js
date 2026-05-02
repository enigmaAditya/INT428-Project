const mongoose = require('mongoose');
const uri = 'mongodb://localhost:27017/investment_bot';
console.log('Attempting to connect to:', uri);
mongoose.connect(uri)
  .then(() => {
    console.log('SUCCESS');
    process.exit(0);
  })
  .catch(err => {
    console.error('FAILURE:', err.message);
    process.exit(1);
  });
setTimeout(() => {
    console.log('TIMEOUT');
    process.exit(1);
}, 5000);
