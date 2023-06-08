require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const router = require('./routes');

app.use(morgan('dev'));
app.use(express.json());

app.use(router);

module.exports = app;