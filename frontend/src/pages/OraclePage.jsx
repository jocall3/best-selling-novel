import React, { useState, useEffect } from 'react';

// Keyframes for animations, defined outside the component
const keyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const OraclePage = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Inject animation styles into the document head once
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = keyframes;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    setAnswer('');
    setError(null);

    try {
      const response = await fetch('/api/oracle/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'The Oracle is silent. Please try again later.' }));
        throw new Error(errorData.message);
      }

      const data = await response.json();
      setAnswer(data.answer);

    } catch (err) {
      setError(err.message || 'An unexpected disturbance occurred in the ether.');
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamic styles
  const buttonStyle = {
    ...styles.button,
    ...(isLoading && styles.buttonLoading),
    ...(!question.trim() && !isLoading && styles.buttonDisabled)
  };

  const textareaStyle = {
    ...styles.textarea,
    ...(isLoading && styles.disabledInput)
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>The AI Oracle</h1>
        <p style={styles.subtitle}>Pose your query to the digital ether and await its wisdom.</p>
      </header>

      <main style={styles.main}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What secrets does the future hold?"
            style={textareaStyle}
            disabled={isLoading}
            rows="4"
          />
          <button
            type="submit"
            style={buttonStyle}
            disabled={isLoading || !question.trim()}
          >
            {isLoading ? 'Consulting the Cosmos...' : 'Ask the Oracle'}
          </button>
        </form>

        <div style={styles.resultsContainer}>
          {isLoading && (
            <div style={styles.loader}>
              <div style={styles.spinner}></div>
              <p>The Oracle is pondering your question...</p>
            </div>
          )}
          {error && <p style={styles.error}>{error}</p>}
          {answer && !isLoading && (
            <div style={styles.answerBox}>
              <h3 style={styles.answerTitle}>The Oracle has spoken:</h3>
              <p style={styles.answerText}>{answer}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Component styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#0a0a1a',
    color: '#e0e0e0',
    fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    padding: '2rem',
    boxSizing: 'border-box',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
    animation: 'fadeIn 1s ease-in-out',
  },
  title: {
    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
    fontWeight: '300',
    color: '#ffffff',
    letterSpacing: '2px',
    margin: '0 0 0.5rem 0',
    textShadow: '0 0 10px rgba(100, 100, 255, 0.3)',
  },
  subtitle: {
    fontSize: 'clamp(1rem, 2vw, 1.1rem)',
    color: '#a0a0c0',
    maxWidth: '600px',
  },
  main: {
    width: '100%',
    maxWidth: '700px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  textarea: {
    width: '100%',
    padding: '1rem',
    fontSize: '1.1rem',
    backgroundColor: '#1a1a3a',
    color: '#e0e0e0',
    border: '1px solid #3a3a5a',
    borderRadius: '8px',
    resize: 'vertical',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    fontFamily: 'inherit',
  },
  disabledInput: {
    backgroundColor: '#2a2a4a',
    cursor: 'not-allowed',
  },
  button: {
    padding: '1rem',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#6200ea',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.1s, opacity 0.3s',
    outline: 'none',
  },
  buttonLoading: {
    backgroundColor: '#4a00b0',
    cursor: 'wait',
  },
  buttonDisabled: {
    backgroundColor: '#3a3a5a',
    cursor: 'not-allowed',
    opacity: 0.7,
  },
  resultsContainer: {
    marginTop: '2.5rem',
    minHeight: '150px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  loader: {
    textAlign: 'center',
    color: '#a0a0c0',
  },
  spinner: {
    border: '4px solid rgba(255, 255, 255, 0.2)',
    borderTop: '4px solid #6200ea',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1rem auto',
  },
  error: {
    color: '#ff4d4d',
    backgroundColor: 'rgba(255, 77, 77, 0.1)',
    border: '1px solid #ff4d4d',
    padding: '1rem',
    borderRadius: '8px',
    textAlign: 'center',
    width: '100%',
  },
  answerBox: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid #3a3a5a',
    borderRadius: '8px',
    padding: '1.5rem',
    animation: 'fadeIn 0.5s ease-in-out',
  },
  answerTitle: {
    margin: '0 0 1rem 0',
    color: '#a0a0c0',
    fontWeight: 'normal',
    borderBottom: '1px solid #3a3a5a',
    paddingBottom: '0.5rem',
  },
  answerText: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
    margin: '0',
    color: '#f0f0f0',
  },
};

export default OraclePage;