export interface RedditResponse {
    title: string;
    url: string;
    author: string;
    score: number;
    created_utc: number;
    subreddit: string;
    thumbnail: string;           // URL of the post thumbnail
    is_video: boolean;          // Indicates if the post contains a video
    post_hint?: string;         // Type of post (image, video, link, etc.)
    preview?: {
        images: Array<{
            source: {
                url: string;
                width: number;
                height: number;
            };
            resolutions: Array<{
                url: string;
                width: number;
                height: number;
            }>;
        }>;
    };
}