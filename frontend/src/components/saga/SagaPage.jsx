import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './SagaPage.css'; // Assuming you have a CSS file for styling

// Utility function to fetch markdown content
const fetchMarkdown = async (pageNumber) => {
  try {
    // In a real application, you might use a dynamic import or a server endpoint
    // For this simulation, we assume the files are accessible via public path
    const response = await fetch(`/saga/page-${pageNumber}.md`);
    if (!response.ok) {
      // If the file doesn't exist (e.g., page 0 or page 6+), throw an error
      throw new Error(`Failed to fetch page ${pageNumber}: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error fetching markdown for page ${pageNumber}:`, error);
    return null;
  }
};

// Configuration for the saga
const MIN_PAGE = 1;
const MAX_PAGE = 5; // Based on the project goal "write first 5 pages"

const SagaPage = () => {
  const { pageNumber: pageParam } = useParams();
  const navigate = useNavigate();

  // Ensure pageNumber is an integer, default to 1 if invalid
  const currentPage = parseInt(pageParam, 10) || MIN_PAGE;

  const [content, setContent] = useState('Loading...');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPageContent = useCallback(async (page) => {
    setIsLoading(true);
    setError(null);
    setContent('Loading...');

    if (page < MIN_PAGE || page > MAX_PAGE) {
      setError(`Page ${page} is out of the defined range (${MIN_PAGE} - ${MAX_PAGE}).`);
      setContent('');
      setIsLoading(false);
      return;
    }

    const markdownContent = await fetchMarkdown(page);

    if (markdownContent) {
      setContent(markdownContent);
    } else {
      setError(`Could not load content for Page ${page}.`);
      setContent('');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Redirect to the correct URL if the parameter is missing or invalid
    if (currentPage < MIN_PAGE || currentPage > MAX_PAGE || isNaN(currentPage)) {
      navigate(`/saga/${MIN_PAGE}`, { replace: true });
      return;
    }
    
    loadPageContent(currentPage);
  }, [currentPage, navigate, loadPageContent]);

  const handleNavigation = (direction) => {
    let newPage = currentPage;
    if (direction === 'next') {
      newPage = currentPage + 1;
    } else if (direction === 'previous') {
      newPage = currentPage - 1;
    }

    if (newPage >= MIN_PAGE && newPage <= MAX_PAGE) {
      navigate(`/saga/${newPage}`);
    }
  };

  const isPreviousDisabled = currentPage <= MIN_PAGE;
  const isNextDisabled = currentPage >= MAX_PAGE;

  return (
    <div className="saga-page-container">
      <header className="saga-header">
        <h1>The Saga - Page {currentPage}</h1>
      </header>

      <main className="saga-content">
        {error && <div className="saga-error">{error}</div>}
        
        {isLoading && !error && (
          <div className="saga-loading">Loading page content...</div>
        )}

        {!isLoading && !error && (
          <div className="markdown-renderer">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        )}
      </main>

      <footer className="saga-navigation">
        <button
          onClick={() => handleNavigation('previous')}
          disabled={isPreviousDisabled || isLoading}
          className="nav-button previous"
        >
          &larr; Previous Page
        </button>
        
        <span className="page-indicator">
          Page {currentPage} of {MAX_PAGE}
        </span>

        <button
          onClick={() => handleNavigation('next')}
          disabled={isNextDisabled || isLoading}
          className="nav-button next"
        >
          Next Page &rarr;
        </button>
      </footer>
    </div>
  );
};

export default SagaPage;