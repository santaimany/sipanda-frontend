import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// index.js atau App.js
import 'leaflet/dist/leaflet.css';

import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

