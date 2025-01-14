const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const postsRouter = require('./routes/posts');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all methods
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/posts', postsRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Handle preflight requests
app.options('*', cors());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

