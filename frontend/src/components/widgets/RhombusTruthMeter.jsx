import React from 'react';
import PropTypes from 'prop-types';

/**
 * A reusable widget that displays a "rhomboidity" score.
 * It renders a geometric shape that morphs from a square (score 0)
 * to a perfect rhombus (score 100) based on the provided score.
 */
const RhombusTruthMeter = ({
  score,
  size,
  strokeColor,
  fillColor,
  strokeWidth,
  className,
}) => {
  // Clamp the score to be within the 0-100 range
  const clampedScore = Math.max(0, Math.min(100, score));
  // Normalize the score to a 0-1 scale for interpolation
  const s = clampedScore / 100;

  // Define the geometry based on the size and stroke width
  const center = size / 2;
  // Use a small padding to prevent the stroke from being clipped by the SVG viewbox
  const padding = strokeWidth / 2;
  const min = padding;
  const max = size - padding;

  // Define the corner points for the two extremes: a square and a rhombus
  const squarePoints = {
    p1: { x: min, y: min },    // Top-left
    p2: { x: max, y: min },    // Top-right
    p3: { x: max, y: max },    // Bottom-right
    p4: { x: min, y: max },    // Bottom-left
  };

  const rhombusPoints = {
    p1: { x: center, y: min }, // Top-center
    p2: { x: max, y: center }, // Right-center
    p3: { x: center, y: max }, // Bottom-center
    p4: { x: min, y: center }, // Left-center
  };

  // Linearly interpolate between the square and rhombus points based on the score
  const p1 = {
    x: squarePoints.p1.x * (1 - s) + rhombusPoints.p1.x * s,
    y: squarePoints.p1.y * (1 - s) + rhombusPoints.p1.y * s,
  };
  const p2 = {
    x: squarePoints.p2.x * (1 - s) + rhombusPoints.p2.x * s,
    y: squarePoints.p2.y * (1 - s) + rhombusPoints.p2.y * s,
  };
  const p3 = {
    x: squarePoints.p3.x * (1 - s) + rhombusPoints.p3.x * s,
    y: squarePoints.p3.y * (1 - s) + rhombusPoints.p3.y * s,
  };
  const p4 = {
    x: squarePoints.p4.x * (1 - s) + rhombusPoints.p4.x * s,
    y: squarePoints.p4.y * (1 - s) + rhombusPoints.p4.y * s,
  };

  // Format the calculated points into a string for the SVG polygon element
  const pointsString = `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`;

  return (
    <div className={`rhombus-truth-meter-widget ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-label={`Truth meter showing a score of ${clampedScore} out of 100, represented as a shape between a square and a rhombus.`}
        role="img"
      >
        <polygon
          points={pointsString}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

RhombusTruthMeter.propTypes = {
  /**
   * The score from 0 to 100 that determines the shape's "rhomboidity".
   * 0 is a square, 100 is a perfect rhombus.
   */
  score: PropTypes.number.isRequired,
  /**
   * The size (width and height) of the widget in pixels.
   */
  size: PropTypes.number,
  /**
   * The color of the shape's outline.
   */
  strokeColor: PropTypes.string,
  /**
   * The color of the shape's fill.
   */
  fillColor: PropTypes.string,
  /**
   * The width of the shape's outline in pixels.
   */
  strokeWidth: PropTypes.number,
  /**
   * Optional CSS class name to apply to the container.
   */
  className: PropTypes.string,
};

RhombusTruthMeter.defaultProps = {
  size: 100,
  strokeColor: '#334155', // slate-700
  fillColor: 'rgba(51, 65, 85, 0.1)', // slate-700 with alpha
  strokeWidth: 2,
  className: '',
};

export default RhombusTruthMeter;