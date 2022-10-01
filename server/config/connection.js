// Import mongoose and set up a connection to our DB
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/campaign-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose.connection;