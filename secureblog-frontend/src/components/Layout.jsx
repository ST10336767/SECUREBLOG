import React from 'react';
import { Link } from "react-router-dom";

const isLoggedIn = () => !!localStorage.getItem("token");

// Layout component with a dynamic navigation menu
export default function Layout  ({ children })  {
  const loggedIn = isLoggedIn();

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 font-inter text-white">
      {/* Navigation bar with dynamic links, aligned to the top left */}
      <nav className="bg-transparent p-4 flex justify-start">
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium">Home</Link>
          </li>
          {loggedIn ? (
            <>
              <li>
                <Link to="/dashboard" className="text-blue-400 hover:text-blue-300 font-medium">Dashboard</Link>
              </li>
              <li>
                <Link to="/logout" className="text-red-400 hover:text-red-300 font-medium">Logout</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">Login</Link>
              </li>
              <li>
                <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      {/* Main content area, now centered */}
      <main className="flex-grow p-4 flex items-center justify-center">
        {children}
      </main>
      {/* A simple, consistent footer, aligned to the bottom left */}
      <footer className="p-4 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} React Auth App. All rights reserved.</p>
      </footer>
    </div>
  );
};