import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Assuming you have a CSS file for styling

const HomePage = () => {
  const [contradictionIndex, setContradictionIndex] = useState(0);

  useEffect(() => {
    // Simulate fetching real-time data for the Global Contradiction Index
    const interval = setInterval(() => {
      setContradictionIndex(prevIndex => Math.max(0, prevIndex + (Math.random() - 0.5) * 10));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div className="home-page-container">
      <header className="hero-section">
        <h1>Welcome to the Inquiry Foundation</h1>
        <p>
          Dedicated to fostering critical thinking, open dialogue, and the pursuit of truth in an increasingly complex world.
          We believe that by questioning assumptions and exploring diverse perspectives, we can build a more informed and resilient society.
        </p>
      </header>

      <main className="content-section">
        <section className="philosophy-section">
          <h2>Our Philosophy</h2>
          <p>
            The Inquiry Foundation champions a methodology rooted in intellectual humility, rigorous analysis, and a commitment to evidence-based reasoning.
            We strive to create a space where challenging ideas are welcomed, and where the process of inquiry itself is valued as a fundamental human endeavor.
            Our work is driven by the belief that understanding the nuances of contradiction and paradox is essential for navigating the complexities of reality.
          </p>
        </section>

        <section className="oracle-link-section">
          <h2>Access the Oracle</h2>
          <p>
            Engage with our advanced reasoning engine, the Oracle, to explore complex questions, test hypotheses, and gain deeper insights.
            The Oracle is a powerful tool designed to assist in your own journey of inquiry.
          </p>
          <Link to="/oracle" className="cta-button">
            Go to the Oracle
          </Link>
        </section>

        <section className="widget-section">
          <h2>Global Contradiction Index</h2>
          <div className="index-widget">
            <p>Current Index:</p>
            <span className="index-value">{contradictionIndex.toFixed(2)}</span>
            <p>
              This real-time index reflects the perceived level of societal contradiction and paradox, based on aggregated data from various global indicators.
              A higher index suggests a greater prevalence of conflicting narratives and unresolved tensions.
            </p>
          </div>
        </section>
      </main>

      <footer className="footer-section">
        <p>&copy; {new Date().getFullYear()} Inquiry Foundation. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;