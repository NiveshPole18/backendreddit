const express = require('express');
const axios = require('axios');
const router = express.Router();

// Custom axios instance with proper headers
const redditAPI = axios.create({
  headers: {
    'User-Agent': 'MyRedditClone/1.0.0 (by /u/Mission-Bid-811)'  // Replace with your Reddit username
  }
});

router.get('/:sort', async (req, res) => {
  try {
    const { sort } = req.params;
    const limit = req.query.limit || 10;
    
    const response = await redditAPI.get(
      `https://www.reddit.com/r/popular/${sort}.json?limit=${limit}&raw_json=1`
    );
    
    const posts = response.data.data.children.map(child => child.data);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    if (error.response?.status === 429) {
      res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    } else {
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const response = await redditAPI.get(
      `https://www.reddit.com/search.json?q=${encodeURIComponent(q)}&raw_json=1`
    );
    
    const posts = response.data.data.children.map(child => child.data);
    res.json(posts);
  } catch (error) {
    console.error('Error searching posts:', error);
    if (error.response?.status === 429) {
      res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    } else {
      res.status(500).json({ error: 'Failed to search posts' });
    }
  }
});

module.exports = router;
