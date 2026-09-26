require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const mongoose = require('mongoose');

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
  });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', require('./routes/api'));

// Daily Cron Job
cron.schedule('0 0 * * *', () => {
  console.log('[CRON] Daily expiry check');
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});