const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db'); 
const authRoutes = require('./src/routes/authRoutes');
const cors = require('cors');




dotenv.config();
const app = express();
app.use(cors()); 


// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
