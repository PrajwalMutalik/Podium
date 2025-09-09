import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; // Import AuthProvider
import './index.css';
import { QuotaProvider } from './context/QuotaContext'; // 👈 Import it


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* Wrap App with AuthProvider */}
        <QuotaProvider>
        <App />
        </QuotaProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);