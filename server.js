require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const FileRecord = require('./models/FileRecord');

const app = express();

// Fixed CORS Middleware
app.use(cors({
  origin: '*', // or specify your frontend URL like 'http://localhost:3000'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Added OPTIONS and other methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false // Set to false when using origin: '*'
}));

// Additional CORS headers for extra compatibility
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URL, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// GET route for file records (this was missing!)
app.get('/api/filerecords', async (req, res) => {
  try {
    const records = await FileRecord.find().limit(100); // Limit for performance
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new file record (admin/data entry)
app.post('/api/filerecords', async (req, res) => {
  try {
    const record = new FileRecord(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Search for a file record (for your frontend form)
app.post('/api/filerecords/search', async (req, res) => {
  const query = {};
  
  if (req.body.fileNoParts === 'four') {
    query.department = req.body.department;
    query.year = req.body.year;
    query.type = req.body.type;
    query.sequence = req.body.sequence;
  }
  if (req.body.fileNoParts === 'three') {
    query.department3 = req.body.department3;
    query.year3 = req.body.year3;
    query.sequence3 = req.body.sequence3;
  }
  
  if (req.body.searchBy === 'passport') {
    query.passportNo = req.body.passportNo;
    query.nationality = req.body.nationality;
  }
  if (req.body.fileType === 'emirateUnifiedNo') {
    query.emirateUnifiedNo = req.body.emirateUnifiedNo;
    query.nationality2 = req.body.nationality2;
  }
  if (req.body.fileType === 'emiratesIdNumber') {
    query.emiratesIdNumber = req.body.emiratesIdNumber;
    query.nationality4 = req.body.nationality4;
  }
  
  try {
    const record = await FileRecord.findOne(query);
    if (!record) return res.status(404).json({ error: 'No record found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API endpoint: http://localhost:${PORT}/api/filerecords`);
});