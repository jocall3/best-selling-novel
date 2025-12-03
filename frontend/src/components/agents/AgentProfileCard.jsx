import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * A reusable card component to display a summary of an AI agent.
 *
 * @param {{ agent: Object }} props - The component props.
 * @param {Object} props.agent - The agent object containing details to display.
 * @param {string|number} props.agent.id - The unique identifier for the agent.
 * @param {string} props.agent.name - The name of the agent.
 * @param {string} props.agent.avatarUrl - The URL for the agent's avatar image.
 * @param {string} props.agent.designation - The agent's title or role.
 * @param {string} props.agent.philosophy - A short quote or core philosophy of the agent.
 * @returns {JSX.Element|null} The rendered agent profile card component.
 */
const AgentProfileCard = ({ agent }) => {
  if (!agent) {
    // Render nothing or a placeholder if no agent data is provided
    return null;
  }

  const { id, name, avatarUrl, designation, philosophy } = agent;

  return (
    <div className="flex flex-col bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 text-center text-gray-300 transform hover:scale-105 hover:shadow-teal-500/20 transition-all duration-300 ease-in-out h-full">
      <div className="flex-shrink-0">
        <img
          src={avatarUrl}
          alt={`${name}'s Avatar`}
          className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-teal-500 object-cover shadow-md"
        />
        <h3 className="text-2xl font-bold text-white mb-1">{name}</h3>
        <h4 className="text-md font-semibold text-teal-400 mb-4 tracking-wide">{designation}</h4>
      </div>
      
      <div className="flex-grow flex flex-col justify-between">
        <p className="text-gray-400 italic mb-6 text-sm">
          "{philosophy}"
        </p>
        
        <Link
          to={`/agents/${id}`}
          className="mt-auto w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75"
          aria-label={`View profile for ${name}`}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

AgentProfileCard.propTypes = {
  /**
   * The agent object containing the information to display on the card.
   */
  agent: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
    designation: PropTypes.string.isRequired,
    philosophy: PropTypes.string.isRequired,
  }).isRequired,
};

export default AgentProfileCard;