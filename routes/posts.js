const express = require('express');
const axios = require('axios');
const router = express.Router();

// Reddit API credentials
const CLIENT_ID = process.env.REDDIT_CLIENT_ID;
const CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET;
const REDDIT_USERNAME = process.env.REDDIT_USERNAME;
const REDDIT_PASSWORD = process.env.REDDIT_PASSWORD;

// Function to get access token
async function getAccessToken() {
  try {
    const response = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      `grant_type=password&username=${REDDIT_USERNAME}&password=${REDDIT_PASSWORD}`,
      {
        auth: {
          username: CLIENT_ID,
          password: CLIENT_SECRET
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

router.get('/:sort', async (req, res) => {
  try {
    const { sort } = req.params;
    const limit = req.query.limit || 10;
    
    const accessToken = await getAccessToken();
    
    const response = await axios.get(
      `https://oauth.reddit.com/r/popular/${sort}.json?limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'MyRedditClone/1.0.0'
        }
      }
    );
    
    const posts = response.data.data.children.map(child => child.data);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts', details: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const accessToken = await getAccessToken();
    
    const response = await axios.get(
      `https://oauth.reddit.com/search.json?q=${encodeURIComponent(q)}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'MyRedditClone/1.0.0'
        }
      }
    );
    
    const posts = response.data.data.children.map(child => child.data);
    res.json(posts);
  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({ error: 'Failed to search posts', details: error.message });
  }
});

module.exports = router;

