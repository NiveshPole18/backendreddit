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

// Posts routes
app.get('/api/posts/:sort', async (req, res) => {
  try {
    const { sort } = req.params;
    const limit = req.query.limit || 10;
    const posts = await postsRouter.fetchPosts(sort, limit);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.get('/api/posts/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    const posts = await postsRouter.searchPosts(q);
    res.json(posts);
  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({ error: 'Failed to search posts' });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
