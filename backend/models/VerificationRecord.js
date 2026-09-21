const mongoose = require('mongoose');

const verificationRecordSchema = new mongoose.Schema({
  instrumentId: { type: String, required: true },
  actualReading: { type: Number, required: true },
  standardReading: { type: Number, required: true },
  passStatus: { type: Boolean, required: true },
  gpsLocation: {
    lat: { type: Number },
    lng: { type: Number }
  },
  photoEvidence: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VerificationRecord', verificationRecordSchema);