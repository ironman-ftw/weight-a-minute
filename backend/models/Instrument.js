const mongoose = require('mongoose');

const instrumentSchema = new mongoose.Schema({
  digitalId: { type: String, required: true, unique: true },
  merchantName: { type: String, required: true },
  category: { type: String, required: true },
  modelNumber: { type: String, required: true },
  serialNumber: { type: String, required: true },
  verificationStatus: { 
    type: String, 
    enum: ['Pending Application', 'Verified', 'Rejected', 'Expired'], 
    default: 'Pending Application' 
  },
  assignedLMO: { type: String, default: null },
  lastVerificationDate: { type: Date },
  expiryDate: { type: Date }
});

module.exports = mongoose.model('Instrument', instrumentSchema);