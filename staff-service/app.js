require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./src/config/db');
const staffRoutes = require('./src/routes/staffs');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/staff', staffRoutes);

// Start the server
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Staff Service running on port ${PORT}`));
