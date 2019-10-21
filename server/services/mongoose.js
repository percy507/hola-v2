const mongoose = require('mongoose');
const log = require('../utils/log');

const dbConnection = mongoose.connection;
const DB_NAME = 'hola_db';

mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`, {
  useNewUrlParser: true
});

dbConnection.on('error', err => {
  log.error(`${err.name}: ${err.message}`);
});

dbConnection.once('open', () => {
  log.success('Database: connect success');
});
