require('dotenv').config();
const express = require('express');
const cors = require('cors');
const extractRoute = require('./routes/extract');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json({ limit: '10mb' })); // Increase payload size limit for base64 images

// Routes
app.use('/api/extract', extractRoute);

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});