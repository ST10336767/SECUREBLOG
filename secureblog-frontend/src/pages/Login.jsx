import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { isValidEmail, isStrongPassword } from '../utils/validators';

export default function LoginPage () {
  // State variables for email, password, and form message
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    // Validate email and password using the utility functions
    if (!email || !password) {
      setMessage({ text: 'Email and password are required.', type: 'error' });
      return;
    }
    if (!isValidEmail(email)) {
      setMessage({ text: 'Invalid email format.', type: 'error' });
      return;
    }
    if (!isStrongPassword(password)) {
      setMessage({ text: 'Password must be at least 8 characters and include letters and numbers.', type: 'error' });
      return;
    }

    const loginData = { email, password };

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      console.log('Login response data:', data);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        console.log("JWT Token stored:", data.token);
        setMessage({ text: 'Login successful!', type: 'success' });
        window.location.href = '/dashboard';
      } else {
        // Use a generic "Invalid credentials" message for login failures
        setMessage({ text: 'Invalid credentials', type: 'error' });
      }

    } catch (error) {
      console.error('Error during login:', error);
      setMessage({ text: 'An error occurred. Please check your connection.', type: 'error' });
    }
  };

  return (
    <div className="w-full p-8 space-y-8 text-white mx-auto">
      <h2 className="text-4xl font-extrabold text-center tracking-tight">Log In</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email-address" className="block text-sm font-medium text-gray-300">Email address</label>
          <div className="mt-1">
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none block w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none block w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-105 transition-all duration-200"
          >
            Log In
          </button>
        </div>
      </form>

      <div className="text-center">
        <Link to="/register" className="text-sm font-medium text-blue-400 hover:text-blue-300 focus:outline-none">
          Don't have an account? Register
        </Link>
      </div>

      {message.text && (
        <div className={`p-4 rounded-md mt-4 text-center ${message.type === 'success' ? 'bg-green-700 text-green-100' : 'bg-red-700 text-red-100'}`}>
          <p>{message.text}</p>
        </div>
      )}
    </div>
  );
};