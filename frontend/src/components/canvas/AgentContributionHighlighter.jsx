import React from "react";
import { useStore } from "../../store/store";

const AgentContributionHighlighter = ({ text }) => {
  const { agentColors } = useStore();

  if (!text) {
    return null;
  }

  const parts = text.split(/\[(\w+):\s*(.*?)]/g);

  const renderedText = parts.map((part, index) => {
    if (index % 3 === 0) {
      // This is regular text
      return <React.Fragment key={index}>{part}</React.Fragment>;
    } else if (index % 3 === 1) {
      // This is the agent name
      const agentName = part;
      const color = agentColors[agentName] || "#000000"; // Default to black if no color is set
      return <strong key={index} style={{ color }}>{agentName}:</strong>;
    } else {
      // This is the agent's content
      const agentContent = part;
      // We need to get the agent name from the previous part to color this correctly.
      // This assumes the structure is always [AgentName: Content]
      // A more robust parsing might be needed if the content itself can contain brackets.
      const agentName = parts[index - 1];
      const color = agentColors[agentName] || "#000000";
      return <span key={index} style={{ color }}>{agentContent}</span>;
    }
  });

  return <div>{renderedText}</div>;
};

export default AgentContributionHighlighter;
