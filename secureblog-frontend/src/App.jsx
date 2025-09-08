import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import axios from 'axios';

import Layout from './components/Layout';
import RegisterPage from './pages/Register';
import LoginPage from './pages/Login';
import DashboardPage from './pages/DashboardPage';
import LogoutPage from './pages/LogoutPage';
import ProtectedRoute from './components/ProtectedRoute';


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Something went wrong.</h1>
          <p className="text-gray-700 mb-4">Please try refreshing the page. If the issue persists, check the console for more details.</p>
          <pre className="bg-gray-200 p-4 rounded-md overflow-x-auto text-sm text-left">{this.state.error.toString()}</pre>
        </div>
      );
    }
    return this.props.children; 
  }
}

// Main App component to handle routing and render the whole application.
export default function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Layout>
          <Routes>
            {/* The root path now directly leads to the protected dashboard */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            {/* Other public routes remain */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* A dedicated dashboard path is also kept for direct navigation */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />

            {/* Logout route */}
            <Route path="/logout" element={<LogoutPage />} />
          </Routes>
        </Layout>
      </ErrorBoundary>
    </Router>
  );
}
