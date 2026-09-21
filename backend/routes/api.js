const express = require('express');
const router = express.Router();

// Temporary in-memory storage
// No MongoDB required for the prototype
let instruments = [];
let verificationRecords = [];

// 1. Get all instruments
router.get('/instruments', (req, res) => {
  try {
    res.json(instruments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Register a new instrument
router.post('/instruments/register', (req, res) => {
  try {
    const {
      merchantName,
      category,
      modelNumber,
      serialNumber
    } = req.body;

    if (!category || !modelNumber || !serialNumber) {
      return res.status(400).json({
        error: 'Category, model number and serial number are required'
      });
    }

    const digitalId = `DI-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newInstrument = {
      _id: Date.now().toString(),
      digitalId,
      merchantName: merchantName || 'Sharma Supermarket',
      category,
      modelNumber,
      serialNumber,
      verificationStatus: 'Pending Application',
      lastVerificationDate: null,
      expiryDate: null,
      createdAt: new Date()
    };

    instruments.unshift(newInstrument);

    res.status(201).json(newInstrument);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Submit LMO Inspection Results
router.post('/verification/submit', (req, res) => {
  try {
    const {
      digitalId,
      actualReading,
      standardReading,
      passStatus,
      lat,
      lng
    } = req.body;

    const instrument = instruments.find(
      item => item.digitalId === digitalId
    );

    if (!instrument) {
      return res.status(404).json({
        error: 'Instrument not found'
      });
    }

    const today = new Date();
    const expiry = new Date();
    expiry.setFullYear(today.getFullYear() + 1);

    const record = {
      _id: Date.now().toString(),
      instrumentId: digitalId,
      actualReading,
      standardReading,
      passStatus,
      gpsLocation: {
        lat,
        lng
      },
      date: today
    };

    verificationRecords.unshift(record);

    instrument.verificationStatus = passStatus
      ? 'Verified'
      : 'Rejected';

    instrument.lastVerificationDate = today;

    instrument.expiryDate = passStatus
      ? expiry
      : null;

    res.json({
      message: 'Inspection recorded',
      instrument: instrument
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Public QR Code Verification
router.get('/public/verify/:digitalId', (req, res) => {
  try {
    const instrument = instruments.find(
      item => item.digitalId === req.params.digitalId
    );

    if (!instrument) {
      return res.status(404).json({
        error: 'Instrument record not found'
      });
    }

    res.json(instrument);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;