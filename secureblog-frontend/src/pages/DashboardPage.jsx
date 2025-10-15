import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import axios from 'axios';

export default function DashboardPage  ()  {
  const [testMsg, setTestMsg] = useState('');

  // Fetch data from a protected backend route using the JWT token
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/test', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => setTestMsg(res.data.message))
      .catch(err => {
        console.error('Error fetching data:', err);
        setTestMsg('Error: Could not fetch data from backend.');
        // If the token is invalid, log out the user
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      });
  }, []);
  
  return (
    <div className="w-full max-w-md p-8 space-y-6 text-center mx-auto">
      <h2 className="text-3xl font-bold text-white">Dashboard</h2>
      <p className="text-gray-300">Backend says: <span className="font-semibold text-green-400">{testMsg}</span></p>
      <Link
        to="/logout"
        className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md group hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Log Out
      </Link>
    </div>
  );
};
