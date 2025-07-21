// bolbhidufront/src/app/visitors/posts/[id]/page.tsx
// This component displays a single blog post based on its ID.

'use client'; // This directive makes the component a Client Component in Next.js

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // For accessing route parameters and navigation

// Define the type for a Post object
interface Post {
  id: number;
  headline: string;
  content: string; // Content is mandatory for a full post view
  tags?: string;
  author: number;
  author_username: string;
  published_date: string;
  updated_date: string;
}

const SinglePostPage: React.FC = () => {
  const params = useParams(); // Get route parameters (e.g., { id: '123' })
  const router = useRouter();
  const postId = params.id; // Extract the post ID from the URL

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Base URL for your Django backend API posts endpoint
  const API_POSTS_URL = 'http://127.0.0.1:8000/api/admin/posts/';

  useEffect(() => {
    console.log('Current URL params:', params); // Debugging: Check all params
    console.log('Extracted postId:', postId); // Debugging: Check the extracted postId

    if (!postId) {
      setError('Post ID is missing in the URL.');
      setIsLoading(false);
      return;
    }

    const fetchPost = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_POSTS_URL}${postId}/`, { // Fetch specific post by ID
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Post not found. It might have been deleted or the ID is incorrect.');
          }
          const errorData = await response.json();
          throw new Error(errorData.detail || `Failed to fetch post: ${response.status}`);
        }

        const data: Post = await response.json();
        setPost(data);
      } catch (err: any) {
        console.error('Failed to fetch post:', err);
        setError(err.message || 'An error occurred while fetching the post.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId, params]); // Re-run effect if postId or params changes

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
        <p className="text-gray-600">Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl border border-red-200 text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
        <p className="text-gray-600">No post found with this ID.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans flex flex-col items-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl border border-gray-200 mt-4">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">{post.headline}</h1>
        <p className="text-gray-600 text-sm text-center mb-6">
          By <span className="font-medium">{post.author_username || 'N/A'}</span> on {new Date(post.published_date).toLocaleString()}
        </p>

        <div className="prose max-w-none text-gray-800 leading-relaxed mb-8">
          {/* Using dangerouslySetInnerHTML for rich text content if needed, otherwise just render post.content */}
          <p>{post.content}</p>
        </div>

        {post.tags && (
          <p className="text-gray-600 text-sm mb-4 text-center">
            Tags: <span className="font-medium text-blue-700">{post.tags.split(',').map(tag => `#${tag.trim()}`).join(' ')}</span>
          </p>
        )}

        <div className="text-center">
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-md"
          >
            Back to Posts
          </button>
        </div>
      </div>
    </div>
  );
};

export default SinglePostPage;
