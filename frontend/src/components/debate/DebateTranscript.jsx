import React from 'react';
import PropTypes from 'prop-types';

const DebateTranscript = ({ transcript }) => {
  if (!transcript || transcript.length === 0) {
    return <div className="debate-transcript empty">No dialogue yet.</div>;
  }

  return (
    <div className="debate-transcript-container">
      {transcript.map((turn, index) => (
        <div
          key={index}
          className={`transcript-turn ${turn.speaker.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <div className="turn-header">
            <span className="speaker-name">{turn.speaker}:</span>
            <span className="turn-timestamp">
              {new Date(turn.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <div className="turn-content">
            {turn.content}
          </div>
        </div>
      ))}
    </div>
  );
};

DebateTranscript.propTypes = {
  transcript: PropTypes.arrayOf(
    PropTypes.shape({
      speaker: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
};

export default DebateTranscript;