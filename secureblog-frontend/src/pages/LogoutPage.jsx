import React, { useEffect } from 'react';

export default function LogoutPage  ()  {
  useEffect(() => {
    // Clear the JWT token from local storage
    localStorage.removeItem('token');
    // Redirect to the home page after logging out
    window.location.href = '/';
  }, []); // The empty dependency array ensures this effect runs only once on mount

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg text-center">
      <h2 className="text-3xl font-bold text-gray-900">Logging out...</h2>
      <p className="text-gray-700">You will be redirected shortly.</p>
    </div>
  );
};