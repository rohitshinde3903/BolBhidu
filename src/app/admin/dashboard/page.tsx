// bolbhidufront/src/app/page.tsx
// This is the main page component for the root route in your Next.js application.

'use client'; // This directive makes the component a Client Component in Next.js

import React, { useState, useEffect } from 'react';

// Define the type for a Message object
interface Message {
  id: number;
  content: string;
  timestamp: string;
}

const HomePage: React.FC = () => {
  const [message, setMessage] = useState<string>(''); // State for the message input field
  const [sentMessage, setSentMessage] = useState<string | null>(null); // State to show confirmation
  const [error, setError] = useState<string | null>(null); // State to show error messages
  const [messages, setMessages] = useState<Message[]>([]); // State to store fetched messages
  const [isLoading, setIsLoading] = useState<boolean>(false); // State for loading indicator

  // Base URL for your Django backend API
  const API_BASE_URL = 'http://127.0.0.1:8000/api/messages/';

  // Function to fetch messages from the backend
  const fetchMessages = async () => {
    setIsLoading(true); // Set loading to true before fetching
    setError(null); // Clear previous errors
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Message[] = await response.json();
      // Sort messages by timestamp in descending order (newest first)
      setMessages(data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch (err: any) {
      console.error('Failed to fetch messages:', err);
      setError(`Failed to fetch messages: ${err.message}`);
    } finally {
      setIsLoading(false); // Set loading to false after fetching
    }
  };

  // useEffect hook to fetch messages when the component mounts
  useEffect(() => {
    fetchMessages();
  }, []); // Empty dependency array means this runs once on mount

  // Function to handle sending a message to the backend
  const handleSendMessage = async () => {
    if (!message.trim()) {
      setError('Message cannot be empty.');
      return;
    }

    setSentMessage(null); // Clear previous confirmation
    setError(null); // Clear previous errors
    setIsLoading(true); // Set loading to true during submission

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: message }), // Send message content as JSON
      });

      if (!response.ok) {
        // If response is not OK, try to parse error message from backend
        const errorData = await response.json();
        throw new Error(errorData.content || `HTTP error! status: ${response.status}`);
      }

      const data: Message = await response.json(); // Parse the successful response
      setSentMessage(`Message sent successfully! ID: ${data.id}`); // Show confirmation
      setMessage(''); // Clear the input field
      fetchMessages(); // Refresh the list of messages
    } catch (err: any) {
      console.error('Failed to send message:', err);
      setError(`Failed to send message: ${err.message}`); // Show error message
    } finally {
      setIsLoading(false); // Set loading to false after submission
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Bolbhidu Messaging App</h1>

      {/* Message Input Section */}
      <div className="mb-6">
        <label htmlFor="messageInput" className="block text-gray-700 text-sm font-semibold mb-2">
          Add a New Message
        </label>
        <textarea
          id="messageInput"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 resize-y min-h-[80px]"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
        ></textarea>
        <button
          onClick={handleSendMessage}
          disabled={isLoading} // Disable button when loading
          className="mt-4 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Send Message'
          )}
        </button>
        {sentMessage && (
          <p className="mt-3 text-green-600 bg-green-100 p-3 rounded-lg text-center">
            {sentMessage}
          </p>
        )}
        {error && (
          <p className="mt-3 text-red-600 bg-red-100 p-3 rounded-lg text-center">
            Error: {error}
          </p>
        )}
      </div>

      {/* Message List Section */}
      <div className="mt-8 border-t pt-6 border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Recent Messages</h2>
        {isLoading && messages.length === 0 && (
          <p className="text-center text-gray-500">Loading messages...</p>
        )}
        {messages.length === 0 && !isLoading && !error && (
          <p className="text-center text-gray-500">No messages yet. Send one!</p>
        )}
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-100">
              <p className="text-gray-800 text-lg mb-2">{msg.content}</p>
              <p className="text-gray-500 text-sm text-right">
                {new Date(msg.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage; // Export the component as default
