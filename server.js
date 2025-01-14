const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const postsRouter = require('./routes/posts');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: ['https://frontendreddit-cin1-96481f2op-ninjabtk66-gmailcoms-projects.vercel.app', 'http://localhost:3000'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/posts', postsRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Handle preflight requests
app.options('*', cors(corsOptions));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

