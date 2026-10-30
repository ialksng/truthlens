import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

const getBasename = () => {
  const path = window.location.pathname;
  if (path.startsWith("/work/projects/truthlens/app")) {
    return "/work/projects/truthlens/app";
  }
  if (path.startsWith("/projects/truthlens")) {
    return "/projects/truthlens";
  }
  return "";
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={getBasename()}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)