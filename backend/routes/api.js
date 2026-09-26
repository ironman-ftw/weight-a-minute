const express = require('express');
const router = express.Router();

const Instrument = require('../models/Instrument');
const VerificationRecord = require('../models/VerificationRecord');

// Temporary in-memory storage
// No MongoDB required for the prototype
let instruments = [];
let verificationRecords = [];

// 1. Get all instruments
router.get('/instruments', async (req, res) => {
  try {
    const instruments = await Instrument.find();
    res.json(instruments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Register a new instrument
router.post('/instruments/register', async (req, res) => {
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

    const newInstrument = await Instrument.create({
      digitalId,
      merchantName: merchantName || 'Sharma Supermarket',
      category,
      modelNumber,
      serialNumber,
      verificationStatus: 'Pending Application'
    });

    res.status(201).json(newInstrument);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Submit LMO Inspection Results
router.post('/verification/submit', async (req, res) => {
  try {
    const {
      digitalId,
      actualReading,
      standardReading,
      passStatus,
      lat,
      lng
    } = req.body;

    const instrument = await Instrument.findOne({
      digitalId: digitalId
    });

    if (!instrument) {
      return res.status(404).json({
        error: 'Instrument not found'
      });
    }

    const today = new Date();

    const expiry = new Date();
    expiry.setFullYear(today.getFullYear() + 1);

    const record = await VerificationRecord.create({
      instrumentId: digitalId,
      actualReading,
      standardReading,
      passStatus,
      gpsLocation: {
        lat,
        lng
      },
      timestamp: today
    });

    instrument.verificationStatus = passStatus
      ? 'Verified'
      : 'Rejected';

    instrument.lastVerificationDate = today;

    instrument.expiryDate = passStatus
      ? expiry
      : null;

    await instrument.save();

    res.json({
      message: 'Inspection recorded',
      instrument: instrument,
      verificationRecord: record
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Public QR Code Verification
router.get('/public/verify/:digitalId', async (req, res) => {
  try {
    const instrument = await Instrument.findOne({
      digitalId: req.params.digitalId
    });

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