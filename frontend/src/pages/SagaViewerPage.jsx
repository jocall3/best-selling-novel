import React, { useState, useEffect, useRef } from 'react';
import './SagaViewerPage.css';

const SagaViewerPage = () => {
  const [chapters, setChapters] = useState([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [chapterContent, setChapterContent] = useState([]);
  const chapterRefs = useRef([]);

  // Mock data for chapters and pages
  useEffect(() => {
    const mockChapters = [
      {
        title: "Chapter 1: The Whispering Woods",
        pages: [
          "In the heart of the Whispering Woods, where ancient trees touched the sky and shadows danced with unseen creatures, a lone traveler named Elara found herself lost. The air was thick with the scent of damp earth and forgotten magic.",
          "She clutched her worn leather-bound journal, its pages filled with cryptic symbols and half-finished maps. Her quest was simple, yet fraught with peril: to find the Sunstone, an artifact rumored to hold the key to restoring balance to the fractured realm.",
          "A rustle in the undergrowth startled her. A pair of luminous eyes peered from the darkness. It was a Sylph, a guardian of the woods, its form shimmering like moonlight on water. 'You tread on sacred ground, mortal,' it whispered, its voice like the sigh of the wind.",
          "'I seek the Sunstone,' Elara replied, her voice steady despite the tremor in her hands. 'The realm is in danger.' The Sylph regarded her for a long moment, its gaze piercing. 'Many have sought it. Few have returned.'"
        ]
      },
      {
        title: "Chapter 2: The Crystal Caves",
        pages: [
          "The Sylph, intrigued by Elara's resolve, guided her through a hidden passage that led into the depths of the Crystal Caves. The walls of the caves pulsed with an ethereal light, reflecting off countless facets of shimmering crystals.",
          "Each crystal seemed to hum with a unique energy, a symphony of light and sound that resonated deep within Elara's soul. She felt a strange connection to this place, as if it held secrets that were meant for her alone.",
          "Deeper within the caves, they encountered a Golem, a creature of living stone, its eyes burning with an ancient fire. It blocked their path, its massive form radiating an aura of immense power. 'None shall pass without proving their worth,' it boomed, its voice like the grinding of mountains."
        ]
      },
      {
        title: "Chapter 3: The Serpent's Lair",
        pages: [
          "After a perilous encounter with the Golem, Elara and the Sylph ventured into the treacherous Serpent's Lair. The air here was heavy with a cloying, reptilian musk, and the ground was littered with the shed skins of colossal serpents.",
          "Whispers of the Great Serpent, Naga, echoed through the cavernous space. It was said that Naga guarded the final resting place of the Sunstone, its scales shimmering with venom and its gaze capable of turning flesh to stone.",
          "Elara knew this would be her greatest challenge. The fate of the realm rested on her ability to overcome the ancient guardian and claim the artifact before darkness consumed all."
        ]
      }
    ];
    setChapters(mockChapters);
    if (mockChapters.length > 0) {
      setChapterContent(mockChapters[0].pages);
      chapterRefs.current = Array(mockChapters.length).fill(0).map((_, i) => chapterRefs.current[i] || React.createRef());
    }
  }, []);

  const handleChapterClick = (index) => {
    setCurrentChapterIndex(index);
    setCurrentPageIndex(0);
    setChapterContent(chapters[index].pages);
    // Scroll to the chapter in the sidebar
    chapterRefs.current[index].current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePageClick = (index) => {
    setCurrentPageIndex(index);
  };

  const handleNextPage = () => {
    if (currentPageIndex < chapterContent.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else if (currentChapterIndex < chapters.length - 1) {
      handleChapterClick(currentChapterIndex + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    } else if (currentChapterIndex > 0) {
      const prevChapterIndex = currentChapterIndex - 1;
      const lastPageIndex = chapters[prevChapterIndex].pages.length - 1;
      handleChapterClick(prevChapterIndex);
      setCurrentPageIndex(lastPageIndex);
    }
  };

  return (
    <div className="saga-viewer-container">
      <div className="sidebar">
        <h2>The Unorthodox Chronicles</h2>
        {chapters.map((chapter, index) => (
          <div
            key={index}
            ref={chapterRefs.current[index]}
            className={`chapter-title ${index === currentChapterIndex ? 'active' : ''}`}
            onClick={() => handleChapterClick(index)}
          >
            {chapter.title}
          </div>
        ))}
      </div>
      <div className="content-area">
        <div className="chapter-header">
          {chapters[currentChapterIndex] && <h3>{chapters[currentChapterIndex].title}</h3>}
        </div>
        <div className="page-content">
          {chapterContent.length > 0 && <p>{chapterContent[currentPageIndex]}</p>}
        </div>
        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={currentChapterIndex === 0 && currentPageIndex === 0}>
            Previous
          </button>
          <span>
            Page {currentPageIndex + 1} of {chapterContent.length}
          </span>
          <button onClick={handleNextPage} disabled={currentChapterIndex === chapters.length - 1 && currentPageIndex === chapterContent.length - 1}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SagaViewerPage;