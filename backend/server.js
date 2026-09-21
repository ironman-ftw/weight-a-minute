const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

const app = express();

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