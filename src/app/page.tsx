// bolbhidufront/src/app/page.tsx
// This is the main application component that renders the HomePage.

'use client'; // This directive makes the component a Client Component in Next.js

import React, { useState, useEffect } from 'react';
import RecentPostsCarousel from '@/components/recentposts/recentpostscarousel'; // Import the new carousel component

// Define the type for a Message object (retained from previous functionality if needed)
interface Message {
  id: number;
  content: string;
  timestamp: string;
}

const HomePage: React.FC = () => {
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-0 font-sans">
      {/* Include the RecentPostsCarousel at the very top of the main page */}
      <RecentPostsCarousel />

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl mt-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Welcome to Bol Bhidu</h1>
        <p className="text-gray-600 mb-4 text-center">
          This is the home page of the Bol Bhidu application. Here you can find recent posts and updates.
        </p>
        <p className="text-gray-600 text-center">
          Explore the latest content and stay connected with our community!
        </p></div>
    </div>
  );
};

export default HomePage;
