import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import '../styles/PieChart.css';

// Emoji imports
import CalendarAngry from '../assets/CalendarEmoji/CalendarAngry.png';
import CalendarDisgust from '../assets/CalendarEmoji/CalendarDisgust.png';
import CalendarFear from '../assets/CalendarEmoji/CalendarFear.png';
import CalendarHappy from '../assets/CalendarEmoji/CalendarHappy.png';
import CalendarSad from '../assets/CalendarEmoji/CalendarSad.png';

const PieChart = ({ data, emotionCode = 4 }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 300 }); // Default fallback

  // ResizeObserver to track container size
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.width, // keep square aspect ratio
        });
      }
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const { width, height } = dimensions;
  const margin = 15;
  const chartWidth = width - margin * 2;
  const chartHeight = height - margin * 2;
  const radius = Math.min(chartWidth, chartHeight) / 2;

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const emotionImages = {
    1: CalendarAngry,
    2: CalendarDisgust,
    3: CalendarFear,
    4: CalendarHappy,
    5: CalendarSad
  };

  const currentEmotionImage = emotionImages[emotionCode] || CalendarHappy;

  const pieGenerator = d3.pie().value(d => d.value);
  const pieData = pieGenerator(data);

  const colorScale = d3.scaleOrdinal()
    .domain(data.map(d => d.name))
    .range(d3.schemeCategory10);

  const nameColors = {
    'Happiness': '#FEF6BE',
    'Anger': '#FFC5B7',
    'Fear': '#F1D5FF',
    'Disgust': '#C8F0C6',
    'Sadness': '#BDEEFF',
  };

  // Responsive sizes based on radius
  const innerRadius = Math.max(radius * 0.33, 20); // Minimum 20px, scales with chart
  const imageSize = innerRadius * 2; // Make image bigger - increased from 2 to 3
  const baseFontSize = "2rem"; // Fixed size as requested
  const nameFontSize = "2rem"; // Fixed size as requested

  // Arc generators (defined after innerRadius)
  const arcGenerator = d3.arc().innerRadius(innerRadius).outerRadius(radius);
  const hoverArcGenerator = d3.arc().innerRadius(innerRadius).outerRadius(radius + 10);
  const labelArcGenerator = d3.arc().innerRadius(radius * 0.8).outerRadius(radius * 0.8);

  return (
    <div className="card pie-chart-container" ref={containerRef}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        height="100%"
      >
        <defs>
          <clipPath id="circleClip">
            <circle cx="0" cy="0" r={innerRadius} />
          </clipPath>
        </defs>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {pieData.map((slice, index) => {
            const isHovered = hoveredIndex === index;

            return (
              <g key={index}>
                <path
                  d={isHovered ? hoverArcGenerator(slice) : arcGenerator(slice)}
                  fill={nameColors[slice.data.name] || '#FEF6BE'} // Changed from colorScale to nameColors
                  stroke="var(--color-dark)"
                  strokeWidth={isHovered ? 3 : 2}
                  style={{
                    cursor: 'pointer',
                    opacity: hoveredIndex !== null && !isHovered ? 0.6 : 1,
                    transition: 'all 0.2s ease-in-out',
                    filter: isHovered ? 'brightness(1.1)' : 'none'
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                <text
                  transform={`translate(${labelArcGenerator.centroid(slice)})`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={isHovered ? baseFontSize : baseFontSize}
                  fontWeight="bold"
                  fill="var(--color-dark)"
                  dy={-12}
                  style={{
                    // textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                    transition: 'all 0.2s ease-in-out',
                    pointerEvents: 'none',
                    opacity: hoveredIndex !== null && !isHovered ? 0.6 : 1
                  }}
                >
                  {slice.data.value}
                </text>
                <text
                  transform={`translate(${labelArcGenerator.centroid(slice)})`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={isHovered ? nameFontSize : nameFontSize}
                  fontWeight="500"
                  fill={'black'}
                  dy={16}
                  style={{
                    color: 'rgba(0,0,0,0.7)',
                    // textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                    transition: 'all 0.2s ease-in-out',
                    pointerEvents: 'none',
                    opacity: hoveredIndex !== null && !isHovered ? 0.6 : 1
                  }}
                >
                  {slice.data.name}
                </text>
              </g>
            );
          })}
          <image
            href={currentEmotionImage}
            x={-imageSize / 2}
            y={-imageSize / 2}
            width={imageSize}
            height={imageSize}
            clipPath="url(#circleClip)"
            style={{
              pointerEvents: 'none',
              transition: 'all 0.3s ease-in-out',
            }}
          />
        </g>
      </svg>
    </div>
  );
};

export default PieChart;
