import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import layout components
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Import page components
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Import global styles
import './App.css';

/**
 * The root component of the application.
 * It sets up the main layout and routing for all pages.
 */
function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <div className="main-layout">
          <Sidebar />
          <main className="content-area">
            <Routes>
              {/* Public and main routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />

              {/* Authenticated or specific routes */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Catch-all route for 404 Not Found pages */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;