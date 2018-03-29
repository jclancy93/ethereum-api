const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
chai.use(chaiHttp);

const Account = require('./../models/account');
const Transaction = require('./../models/transaction');

const server = require('./../app');

describe('==== ACCOUNT ROUTES ====', () => {

	const address = '0x3b1349d837fa08070694d329146a6a99a4bdd924';
	const address2 = '0x3b1349d837fa08070694d329146a6a99a4bdd923';

	before((done) => {	

		let transaction = new Transaction({
			_id: new mongoose.Types.ObjectId(),
			blockNumber: 100,
			hash: '0xc7851013c62b012e774fe95571fc7b540152795ac2d2814c4aada9c5d913337f',
			nonce: 50, 
			blockHash: '0xc7851013c62b012e774fe95571fc7b540152795ac2d2814c4aada9c5d913337f',
			gas: 200000, 
			isError: false,
			to: address,
			from: address2
		});

		let account = new Account({
			address: address,
			balance: 2533504046896761000,
			transactions: [transaction._id],
		});

		transaction.save((done) => {});
		account.save((done) => {});
		done();
	});

	after((done) => {

		Account.collection.drop();
		Transaction.collection.drop();
		done();
	});

	it('should retrieve info for an account', (done) => {
		chai.request(server)
			.get(`/accounts/${address}`)
			.end((err, res) => {
				should.not.exist(err);
				res.status.should.eql(200);
				res.body.data.length.should.equal(1);
				res.body.data[0].should.have.property('_id');
				res.body.data[0].should.have.property('balance');
				res.body.data[0].should.have.property('address');
				res.body.data[0].address.should.equal('0x3b1349d837fa08070694d329146a6a99a4bdd924');
				res.body.data[0].transactions.length.should.equal(1);
				done();
			});
	});

	it('should validate an address', (done) => {
		chai.request(server)
		.get('/accounts/-1')
		.end((err, res) => {
			should.not.exist(err);
			res.status.should.eql(500);
			res.body.error.should.equal("Not a valid address")
			done();
		});
	});

	it('should retrieve transactions for an account', (done) => {
		chai.request(server)
			.get(`/accounts/${address}/transactions`)
			.end((err, res) => {
				should.not.exist(err);
				res.status.should.eql(200);
				res.body.data.length.should.equal(1);
				res.body.data[0].should.have.property('_id');
				res.body.data[0].should.have.property('nonce');
				res.body.data[0].should.have.property('hash');
				res.body.data[0].should.have.property('to');
				res.body.data[0].to.should.equal(address)
				done();
			});
	});

	it('should retrieve transactions for an account given a querystring', (done) => {
		chai.request(server)
			.get(`/accounts/${address}/transactions?isError=false&blockNumber=100`)
			.end((err, res) => {
				should.not.exist(err);
				res.status.should.eql(200);
				res.body.data.length.should.equal(1);
				res.body.data[0].should.have.property('_id');
				res.body.data[0].should.have.property('nonce');
				res.body.data[0].should.have.property('hash');
				res.body.data[0].should.have.property('to');
				res.body.data[0].to.should.equal(address);
				res.body.data[0].should.have.property('blockNumber');
				res.body.data[0].blockNumber.should.equal(100);
				done();
			});
	});
});