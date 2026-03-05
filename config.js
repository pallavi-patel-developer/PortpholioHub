if (typeof window !== 'undefined') {
  window.process = window.process || { env: {} };
  window.process.env = window.process.env || {};

  // Set BACKEND_URL based on hostname (Local vs Production)
  window.process.env.BACKEND_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000'
    : 'https://portpholiohub.onrender.com';
}
