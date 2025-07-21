// bolbhidufront/src/app/admin/dashboard/page.tsx
// This component serves as the custom admin dashboard for managing blog posts.

'use client'; // This directive makes the component a Client Component in Next.js

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // For navigation in Next.js App Router

// Define the type for a Post object
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

const AdminDashboardPage: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [newPostHeadline, setNewPostHeadline] = useState<string>('');
  const [newPostContent, setNewPostContent] = useState<string>('');
  const [newPostTags, setNewPostTags] = useState<string>('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Base URL for your Django backend API posts endpoint
  const API_POSTS_URL = 'http://127.0.0.1:8000/api/admin/posts/';

  // Effect to check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // If no token, redirect to login page
      router.push('/auth/login');
    } else {
      setIsAuthenticated(true);
      fetchPosts(token); // Fetch posts if authenticated
    }
  }, [router]); // Dependency array includes router to avoid lint warnings

  // Function to fetch posts from the backend
  const fetchPosts = async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_POSTS_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`, // Include the authentication token
        },
      });

      if (!response.ok) {
        if (response.status === 401) { // Unauthorized
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            router.push('/auth/login');
            throw new Error('Authentication expired. Please log in again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to fetch posts: ${response.status}`);
      }

      const data: Post[] = await response.json();
      setPosts(data);
    } catch (err: any) {
      console.error('Failed to fetch posts:', err);
      setError(err.message || 'An error occurred while fetching posts.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle adding a new post
  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Basic validation
    if (!newPostHeadline.trim()) {
      setError('Headline cannot be empty.');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Not authenticated. Please log in.');
      router.push('/auth/login');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(API_POSTS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`, // Include the authentication token
        },
        body: JSON.stringify({
          headline: newPostHeadline,
          content: newPostContent,
          tags: newPostTags,
          // author will be automatically set by the backend based on the authenticated user
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            router.push('/auth/login');
            throw new Error('Authentication expired. Please log in again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to add post: ${response.status}`);
      }

      const newPost: Post = await response.json();
      setSuccessMessage(`Post "${newPost.headline}" added successfully!`);
      setNewPostHeadline('');
      setNewPostContent('');
      setNewPostTags('');
      fetchPosts(token); // Refresh the list of posts
    } catch (err: any) {
      console.error('Failed to add post:', err);
      setError(err.message || 'An error occurred while adding the post.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    router.push('/auth/login');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans flex flex-col items-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out shadow-md"
          >
            Logout
          </button>
        </div>

        {/* Add New Post Section */}
        <div className="mb-8 border-b pb-6 border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Post</h2>
          <form onSubmit={handleAddPost} className="space-y-4">
            <div>
              <label htmlFor="headline" className="block text-gray-700 text-sm font-semibold mb-2">
                Headline <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="headline"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                placeholder="Enter post headline"
                value={newPostHeadline}
                onChange={(e) => setNewPostHeadline(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-gray-700 text-sm font-semibold mb-2">
                Content (Optional)
              </label>
              <textarea
                id="content"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 resize-y min-h-[100px]"
                placeholder="Enter post content"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={5}
              ></textarea>
            </div>
            <div>
              <label htmlFor="tags" className="block text-gray-700 text-sm font-semibold mb-2">
                Tags (Comma-separated, e.g., politics, sports)
              </label>
              <input
                type="text"
                id="tags"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                placeholder="Enter tags"
                value={newPostTags}
                onChange={(e) => setNewPostTags(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Add Post'
              )}
            </button>
            {successMessage && (
              <p className="mt-4 text-green-600 bg-green-100 p-3 rounded-lg text-center">
                {successMessage}
              </p>
            )}
            {error && (
              <p className="mt-4 text-red-600 bg-red-100 p-3 rounded-lg text-center">
                Error: {error}
              </p>
            )}
          </form>
        </div>

        {/* Existing Posts Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Existing Posts</h2>
          {isLoading && posts.length === 0 && (
            <p className="text-center text-gray-500">Loading posts...</p>
          )}
          {posts.length === 0 && !isLoading && !error && (
            <p className="text-center text-gray-500">No posts found. Add one above!</p>
          )}
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-100">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{post.headline}</h3>
                {post.content && <p className="text-gray-700 text-base mb-2">{post.content.substring(0, 150)}...</p>}
                {post.tags && (
                  <p className="text-gray-600 text-sm mb-1">
                    Tags: <span className="font-medium">{post.tags}</span>
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
    </div>
  );
};

export default AdminDashboardPage;
