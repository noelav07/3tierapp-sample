const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const cors = require('cors');
const db = require('./configs/db');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// API routes
app.use('/api', routes);

// Add your routes here
app.use('/api', routes);

module.exports = app;