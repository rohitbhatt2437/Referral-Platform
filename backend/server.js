// Import required packages
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');

const authRoutes = require('./routes/auth.js')
const profileRoute = require('./routes/profile.js')
const referralRoute = require('./routes/referral.js')

// Initialize the app
const app = express();

// Middleware
app.use(cors()); // Allows requests from other origins (our frontend)
app.use(express.json()); // Parses incoming JSON requests
dotenv.config();

connectDB();

// A simple test route
app.get('/', (req, res) => {
  res.send('Hello, Referral Platform API!');
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoute);
app.use('/api/referrals', referralRoute);

// Define a port and start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});