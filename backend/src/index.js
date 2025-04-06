// src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Import the aggregator
const mainRouter = require('./routes'); 
// or if you put it in ./routes/index.js, do exactly:
// const mainRouter = require('./routes/index');

// Mount it at '/'
app.use('/', mainRouter);

// Test route
app.get('/', (req, res) => {
  res.send('Hello from the Express + JWT server!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
