import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/globals.css';
import { CartProvider } from './context/CartContext';
import ReactGA from "react-ga4";

// Initialize GA4 with the Measurement ID
ReactGA.initialize("G-DBXHSFXGYK");

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);
