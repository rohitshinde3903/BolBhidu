// bolbhidufront/src/components/recentposts/recentpostscarausel.tsx
// This component displays recent blog post headlines in a horizontally scrolling carousel (news ticker style).

'use client'; // This directive makes the component a Client Component in Next.js

import React, { useState, useEffect } from 'react';

// Define the type for a Post object
interface Post {
  id: number;
  headline: string;
  // content?: string; // Not needed for carousel
  // tags?: string; // Not needed for carousel
  // author: number; // Not needed for carousel
  // author_username: string; // Not needed for carousel
  // published_date: string; // Not needed for carousel
  // updated_date: string; // Not needed for carousel
}

const RecentPostsCarousel: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Base URL for your Django backend API posts endpoint (publicly accessible for GET)
  const API_POSTS_URL = 'http://127.0.0.1:8000/api/admin/posts/';

  // Function to fetch posts from the backend
  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_POSTS_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to fetch posts: ${response.status}`);
      }

      const data: Post[] = await response.json();
      // Posts are already ordered by newest first from the backend (PostViewSet queryset)
      setPosts(data);
    } catch (err: any) {
      console.error('Failed to fetch posts for carousel:', err);
      setError(err.message || 'An error occurred while fetching posts for carousel.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch posts when the component mounts
  useEffect(() => {
    fetchPosts();
  }, []); // Empty dependency array means this runs once on mount

  if (isLoading && posts.length === 0) {
    return (
      <div className="bg-gray-800 text-white p-2 text-center text-sm">
        Loading latest headlines...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-700 text-white p-2 text-center text-sm">
        Error loading headlines: {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-gray-800 text-white p-2 text-center text-sm">
        No recent headlines available.
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-800 text-white py-2 px-4 overflow-hidden relative shadow-md">
      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .ticker-wrap {
          display: flex;
          white-space: nowrap;
          animation: ticker var(--ticker-speed) linear infinite;
          animation-delay: 1s; /* Delay before first loop starts */
        }
        .ticker-item {
          padding-right: 2rem; /* Space between headlines */
          font-weight: 500;
          font-size: 0.9rem; /* Slightly smaller font for ticker */
          color: #a0aec0; /* Lighter gray for headlines */
        }
        .ticker-item:hover {
          color: #fff; /* White on hover */
        }
        .ticker-item span {
          color: #4299e1; /* Blue for "NEW" tag */
          font-weight: 700;
          margin-right: 0.5rem;
        }
      `}</style>
      <div className="ticker-container flex overflow-hidden">
        <div className="ticker-wrap" style={{ '--ticker-speed': `${posts.length * 5}s` } as React.CSSProperties}>
          {/* Duplicate posts to ensure continuous scrolling */}
          {posts.concat(posts).map((post, index) => (
            <span key={`${post.id}-${index}`} className="ticker-item">
              <span>NEW:</span> {post.headline}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentPostsCarousel;
