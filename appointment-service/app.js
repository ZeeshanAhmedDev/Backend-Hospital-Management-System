require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./src/config/db');
const appointmentRoutes = require('./src/routes/appointments');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/appointments', appointmentRoutes);

// Start the server
const PORT = process.env.PORT || 6001;
app.listen(PORT, () => console.log(`Appointment Service running on port ${PORT}`));
