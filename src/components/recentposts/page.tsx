// bolbhidufront/src/app/visitors/posts/recentposts/page.tsx
// This component displays recent blog posts for public visitors.

'use client'; // This directive makes the component a Client Component in Next.js

import React, { useState, useEffect } from 'react';

// Define the type for a Post object (same as in AdminDashboardPage)
interface Post {
  id: number;
  headline: string;
  content?: string; // Optional field
  tags?: string; // Optional field
  author: number; // User ID of the author
  author_username: string; // Username of the author (read-only from backend)
  published_date: string;
  updated_date: string;
}

const RecentPostsPage: React.FC = () => {
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
      console.error('Failed to fetch posts:', err);
      setError(err.message || 'An error occurred while fetching posts.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch posts when the component mounts
  useEffect(() => {
    fetchPosts();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans flex flex-col items-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Recent BolBhidu Posts</h1>

        {isLoading && posts.length === 0 && (
          <p className="text-center text-gray-500">Loading posts...</p>
        )}
        {posts.length === 0 && !isLoading && !error && (
          <p className="text-center text-gray-500">No posts available yet. Check back soon!</p>
        )}
        {error && (
          <p className="mt-4 text-red-600 bg-red-100 p-3 rounded-lg text-center">
            Error: {error}
          </p>
        )}

        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{post.headline}</h3>
              {post.content && <p className="text-gray-700 text-base leading-relaxed mb-3">{post.content}</p>}
              {post.tags && (
                <p className="text-gray-600 text-sm mb-2">
                  Tags: <span className="font-medium text-blue-700">{post.tags}</span>
                </p>
              )}
              <p className="text-gray-500 text-sm text-right">
                Author: <span className="font-medium">{post.author_username || 'N/A'}</span> | Published: {new Date(post.published_date).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentPostsPage;
