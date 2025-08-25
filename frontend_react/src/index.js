import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import useAuthStore from './store/authStore';

function Root() {
  const bootstrap = useAuthStore(s => s.bootstrap);
  useEffect(() => { bootstrap(); }, [bootstrap]);
  return <App />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
