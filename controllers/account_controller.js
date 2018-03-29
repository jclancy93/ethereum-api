const request = require('request-promise-native');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const asyncMiddleware = require('./../helpers/async').asyncMiddleware;
const EthereumHelper = require('./../helpers/ethereum');

// Models 
const Account = require('./../models/account');
const Transaction = require('./../models/transaction');

exports.initializeAccount = asyncMiddleware(async (req, res, next) => {

	// First check if account already exists and
	// return user an error message if it is
	const address = req.params.account;

	if (!EthereumHelper.isAddress(address)) {
		return res.status(500).send({error: 'Not a valid address'});
	}

	const accountExists = await Account.find({ address });

	if (accountExists.length) {
		return res.json({message: 'Account already stored'});
	}

	const apiUrl = 'https://api.etherscan.io/api/?module=account';
	const accountApiEndpoint = `${apiUrl}&action=balance&address=${address}`;

	// Note: This will only get last 10,000 transactions
	const txListApiEndpoint = `${apiUrl}&action=txlist&address=${address}`;

	const accountResponse = await request(accountApiEndpoint);
	const accountTxResponse = await request(txListApiEndpoint);

	const balance = JSON.parse(accountResponse).result;
	const transactionData = JSON.parse(accountTxResponse).result;
	const transactions = await Transaction.insertMany(transactionData);

	const transactionIds = transactions.map((a) => ObjectId(a._id));
	const accountDocument = {
		address,
		transactions: transactionIds,
		balance
	};
	const account = await Account.create(accountDocument);

	return res.json({message: 'Account stored'});
});

exports.getTransactions = asyncMiddleware( async (req, res, next) => {
	
	const address = req.params.account;

	if (!EthereumHelper.isAddress(address)) {
		return res.status(500).send({error: 'Not a valid address'});
	}

	// Building Mongoose query from querystring
	let query = {};
	// Automatically setting to and from to address as to
	// pick up all tx from address (can filter more later)
	query.$or = [
		{ to: address },
		{ from: address }
	];
	for(var key in req.query) { 

		// Check for minBlock and filter by blocks >
		if (key === 'minBlock') {
			if (query.blockNumber) {
				query.blockNumber.$gt = req.query[key];
				continue;
			} else {
				query.blockNumber = {};
				query.blockNumber.$gt = req.query[key];
				continue;
			}
		}

		// Check for maxBlock and filter by blocks <
		if (key === 'maxBlock') {
			if (query.blockNumber) {
				query.blockNumber.$lt = req.query[key];
				continue;
			} else {
				query.blockNumber = {};
				query.blockNumber.$lt = req.query[key];
				continue;
			}
		}

		query[key] = req.query[key];
	}

	const transactions = await Transaction.find(query);

	return res.json({ data: transactions });
});

exports.getAccountInfomation = asyncMiddleware(async (req, res, next) => {

	const address = req.params.account;

	if (!EthereumHelper.isAddress(address)) {
		return res.status(500).send({error: 'Not a valid address'});
	}

	const account = await Account.find({ address });

	return res.json({ data: account });
});