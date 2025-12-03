require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const pageRoutes = require('./routes/pageRoutes');

// --- App Initialization ---
const app = express();

// --- Middleware ---
// Enable Cross-Origin Resource Sharing for all routes
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Parse incoming URL-encoded requests
app.use(express.urlencoded({ extended: true }));


// --- API Routes ---
// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Backend server is running successfully.' });
});

// Mount page-related routes
app.use('/api/pages', pageRoutes);


// --- Global Error Handling Middleware ---
// This middleware will catch any errors that occur in the route handlers
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


// --- Database Connection & Server Start ---
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI is not defined in the .env file.');
  process.exit(1);
}

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Successfully connected to MongoDB.');
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
})
.catch((error) => {
  console.error('Database connection failed. Server not started.', error);
  process.exit(1);
});