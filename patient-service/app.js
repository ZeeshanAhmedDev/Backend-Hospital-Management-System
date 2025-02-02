require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./src/config/db');

const patientRoutes = require('./src/routes/patients');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/patients', patientRoutes);

// Start the server
const PORT = process.env.PORT || 7001;
app.listen(PORT, () => console.log(`Patient Service running on port ${PORT}`));
