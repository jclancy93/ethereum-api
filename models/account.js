const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
	address: {type: String, index: {unique: true}},
	balance: Number,
	transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction'}]
});

module.exports = mongoose.model('Account', AccountSchema);