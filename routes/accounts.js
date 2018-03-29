const express = require('express');
const router = express.Router();

const AccountController = require('../controllers/account_controller.js')


/* GET store associated account information in database */
router.get('/:account/initialize', AccountController.initializeAccount);

/* GET transactions associated with address */
router.get('/:account/transactions', AccountController.getTransactions);

/* GET balance & other info associated with address */
router.get('/:account', AccountController.getAccountInfomation);

module.exports = router;
