const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/:sort', async (req, res) => {
  try {
    const { sort } = req.params;
    const limit = req.query.limit || 10;
    
    const response = await axios.get(
      `https://www.reddit.com/r/popular/${sort}.json?limit=${limit}`
    );
    
    const posts = response.data.data.children.map(child => child.data);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const response = await axios.get(
      `https://www.reddit.com/search.json?q=${encodeURIComponent(q)}`
    );
    
    const posts = response.data.data.children.map(child => child.data);
    res.json(posts);
  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({ error: 'Failed to search posts' });
  }
});

module.exports = router;

