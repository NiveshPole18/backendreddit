const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const postsRouter = require('./routes/posts');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: [
    'https://frontendreddit-cin1.vercel.app',
    'https://frontendreddit-cin1-g36bgs53k-ninjabtk66-gmailcoms-projects.vercel.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Mount the router
app.use('/api/posts', postsRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
