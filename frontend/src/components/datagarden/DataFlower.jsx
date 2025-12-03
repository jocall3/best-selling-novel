import React from 'react';

/**
 * A component representing a single dataset in the Data Garden.
 * Its petals could represent different metrics, and its color could change based on the 'mood' of the data.
 *
 * @param {object} props - The component props.
 * @param {object} props.dataset - The dataset object. Expected to have at least `id` and `name`.
 * @param {Array<object>} props.metrics - An array of metric objects. Each metric can have `name`, `value`, and `color`.
 * @param {'happy' | 'neutral' | 'sad' | 'critical' | 'warning' | string} props.mood - The 'mood' of the data, influencing the flower's base color.
 * @param {function} [props.onClick] - Optional click handler for the flower.
 */
const DataFlower = ({ dataset, metrics = [], mood = 'neutral', onClick }) => {
  const flowerSize = 120; // Overall size of the flower SVG (width and height)
  const coreRadius = flowerSize * 0.2; // Radius of the central circle
  const petalLength = flowerSize * 0.35; // Length of each petal
  const petalWidth = flowerSize * 0.15; // Width of each petal

  // Map mood to a base color for the flower
  const getMoodColor = (currentMood) => {
    switch (currentMood) {
      case 'happy':
        return '#8BC34A'; // Light Green
      case 'neutral':
        return '#2196F3'; // Blue
      case 'sad':
        return '#9E9E9E'; // Grey
      case 'critical':
        return '#F44336'; // Red
      case 'warning':
        return '#FFC107'; // Amber
      default:
        return '#9C27B0'; // Purple (default)
    }
  };

  const baseColor = getMoodColor(mood);

  // Determine the number of petals. Ensure at least 4 for a flower-like shape.
  const numPetals = Math.max(metrics.length, 4);
  const angleStep = 360 / numPetals;

  return (
    <div
      className="data-flower-container"
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '1rem',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease-in-out',
        userSelect: 'none', // Prevent text selection on the flower
      }}
      onClick={onClick}
      title={dataset?.name || 'Data Flower'}
      onMouseEnter={(e) => {
        if (onClick) e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        if (onClick) e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <svg
        width={flowerSize}
        height={flowerSize}
        viewBox={`0 0 ${flowerSize} ${flowerSize}`}
        aria-label={`Data Flower for ${dataset?.name || 'Unnamed Dataset'}`}
      >
        {/* Petals */}
        {Array.from({ length: numPetals }).map((_, i) => {
          const angle = i * angleStep;
          // Rotate each petal around the center of the SVG
          const rotation = `rotate(${angle} ${flowerSize / 2} ${flowerSize / 2})`;

          // Petal color based on metric's specific color or the flower's base mood color
          const petalColor = metrics[i]?.color || baseColor;
          
          // Example: Use metric value to influence opacity (assuming value is 0-100)
          const metricValue = metrics[i]?.value;
          const opacity = metricValue !== undefined ? Math.max(0.3, Math.min(1, metricValue / 100)) : 1;

          // Petal position: The center of the petal when it's at 0 degrees (pointing upwards)
          // It's placed above the flower's core, offset by coreRadius + half of petalLength
          const petalCx = flowerSize / 2;
          const petalCy = flowerSize / 2 - (coreRadius + petalLength / 2);

          return (
            <ellipse
              key={`petal-${i}`}
              cx={petalCx}
              cy={petalCy}
              rx={petalWidth / 2}
              ry={petalLength / 2}
              fill={petalColor}
              opacity={opacity}
              transform={rotation}
              style={{ transition: 'fill 0.3s ease, opacity 0.3s ease' }}
            >
              {metrics[i] && <title>{`${metrics[i].name}: ${metrics[i].value}`}</title>}
            </ellipse>
          );
        })}

        {/* Core of the flower */}
        <circle
          cx={flowerSize / 2}
          cy={flowerSize / 2}
          r={coreRadius}
          fill={baseColor}
          stroke="#fff"
          strokeWidth="2"
          style={{ transition: 'fill 0.3s ease' }}
        >
          <title>{dataset?.name || 'Dataset'}</title>
        </circle>
      </svg>
      {dataset?.name && (
        <div
          style={{
            marginTop: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            color: '#333',
            textAlign: 'center',
            maxWidth: `${flowerSize}px`,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {dataset.name}
        </div>
      )}
    </div>
  );
};

export default DataFlower;