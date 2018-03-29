const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
chai.use(chaiHttp);

const Account = require('./../models/account');
const Transaction = require('./../models/transaction');

const server = require('./../app')

describe('==== ACCOUNT ROUTES ====', () => {
	it('should retrieve info for an account', (done) => {
	  chai.request(server)
      .get('/')
      .set('authorization', 'Bearer ' + process.env.AUTH_TOKEN)
      .end((err, res) => {
        should.not.exist(err)
        res.status.should.eql(200)
        done()
      })
	})
})