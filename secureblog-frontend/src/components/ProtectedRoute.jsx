import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import axios from 'axios';

export default function ProtectedRoute ({ children })  {
  const token = localStorage.getItem('token');
  if (!token) {
    // If no token exists, redirect to the login page
    return <Navigate to="/login" replace />;
  }
  return children;
};