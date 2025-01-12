import { Router, Request, Response } from 'express';
import axios from 'axios';
import rateLimit from 'express-rate-limit';
import type { RedditResponse } from '../types/reddit';

const router = Router();

// Rate limiter remains the same...
const searchLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many search requests, please try again later',
});

router.get('/:sort', async (req: Request, res: Response): Promise<any> => {
    try {
        const { sort } = req.params;
        const limit = parseInt(req.query.limit as string) || 10;

        if (!['hot', 'new', 'controversial', 'top', 'rising'].includes(sort)) {
            return res.status(400).json({ error: 'Invalid sort parameter. Allowed: hot, new, top, rising' });
        }

        const response = await axios.get<{ data: { children: Array<{ data: RedditResponse }> } }>(
            `https://www.reddit.com/r/popular/${sort}.json?limit=${limit}`,
            {
                timeout: 5000,
                headers: {
                    'User-Agent': 'reddit-clone-app/1.0.0',
                },
            }
        );

        // Map posts with the correct interface properties
        const posts = response.data.data.children.map((child) => ({
            title: child.data.title,
            url: child.data.url,
            author: child.data.author,
            score: child.data.score,
            created_utc: child.data.created_utc,
            subreddit: child.data.subreddit,
            thumbnail: child.data.thumbnail,
            is_video: child.data.is_video,
            post_hint: child.data.post_hint,
            preview: child.data.preview
        }));

        return res.status(200).json(posts);
    } catch (error) {
        // Error handling remains the same...
        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            return res.status(status).json({ error: 'Failed to fetch posts' });
        }
        return handleError(error, res);
    }
});

router.get('/search', searchLimiter, async (req: Request, res: Response): Promise<any> => {
    try {
        const { q } = req.query;

        if (!q || typeof q !== 'string') {
            return res.status(400).json({ error: 'Valid search query is required' });
        }

        const sanitizedQuery = encodeURIComponent(q.trim().substring(0, 100));

        const response = await axios.get<{ data: { children: Array<{ data: RedditResponse }> } }>(
            `https://www.reddit.com/search.json?q=${sanitizedQuery}&limit=25`,
            {
                timeout: 5000,
                headers: {
                    'User-Agent': 'reddit-clone-app/1.0.0',
                },
            }
        );

        // Map posts with the correct interface properties
        const posts = response.data.data.children
            .map((child) => ({
                title: child.data.title,
                url: child.data.url,
                author: child.data.author,
                score: child.data.score,
                created_utc: child.data.created_utc,
                subreddit: child.data.subreddit,
                thumbnail: child.data.thumbnail,
                is_video: child.data.is_video,
                post_hint: child.data.post_hint,
                preview: child.data.preview
            }))
            .filter((post) => post.title && post.url);

        return res.status(200).json(posts);
    } catch (error) {
        // Error handling remains the same...
        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            const message = status === 429 ? 'Rate limit exceeded' : 'Failed to fetch posts';
            return res.status(status).json({ error: message });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;

function handleError(error: unknown, res: Response): Response {
        console.error('Unhandled error:', error);
        return res.status(500).json({ error: 'Internal server error' });
}
