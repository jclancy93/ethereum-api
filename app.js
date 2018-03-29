const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const accountRouter = require('./routes/accounts');

const app = express();

app.set('json spaces', 2)

mongoose.connect('mongodb://localhost:27017/ethereum_api')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/accounts', accountRouter);

module.exports = app;
