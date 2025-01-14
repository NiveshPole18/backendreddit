const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const postsRouter = require('./routes/posts');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'https://frontendreddit-cin1.vercel.app/', // Frontend URL
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
}));
app.use(express.json());

app.use('/api/posts', postsRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

