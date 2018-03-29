const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  blockNumber: Number,
  nonce: Number,
  hash: {type: String, index: {unique: true}},
  timestamp: Number,
  blockHash: String,
  transactionIndex: Number,
  from: String,
  to: String,
  value: Number,
  gas: Number,
  gasPrice: String,
  isError: Boolean,
  cumulativeGasUsed: String,
  gasUsed: Number, 
  input: String,
  confirmations: Number 
});

module.exports = mongoose.model('Transaction', TransactionSchema);