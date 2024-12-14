import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router } from 'wouter'; // Import Router from wouter
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
