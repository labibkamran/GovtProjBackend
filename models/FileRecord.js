const mongoose = require('mongoose');

const FileRecordSchema = new mongoose.Schema({
  // --- Identification fields (used for search) ---
  gccCitizen: Boolean,
  searchBy: { type: String, enum: ['fileNo', 'passport'], required: true },
  selectType: { type: String, enum: ['residency', 'visa', 'emiratesId'] },
  fileType: { type: String, enum: ['emirateUnifiedNo', 'fileNo', 'emiratesIdNumber'] },

  // Passport Information
  passportNo: String,
  passportExpiry: Date,
  nationality: String,

  // Emirate Unified Number
  emirateUnifiedNo: String,
  nationality2: String,
  dob1: Date,

  // File No. (Four/Three Parts)
  fileNoParts: { type: String, enum: ['four', 'three'] },
  department: String,
  year: String,
  type: String,
  sequence: String,
  department3: String,
  year3: String,
  sequence3: String,
  nationality3: String,
  dob2: Date,

  // Emirates ID Number
  emiratesIdNumber: String,
  nationality4: String,
  dob3: Date,

  // --- File Information (the actual record/result) ---
  fileNo: String,
  emirateUnifiedNoResult: String,
  fileStatus: String,
  fileExpireDate: Date,
  fileCancellationDate: Date,
  fileIssuanceDate: Date,
  lastDateOfLeavingCountry: Date,

  // --- Other fields ---
  recaptcha: Boolean,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FileRecord', FileRecordSchema); 