import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import '../styles/PieChart.css';
import { useUser } from '../context/UserContext';
import api from '../api';

// Emoji imports
import CalendarAngry from '../assets/CalendarEmoji/CalendarAngry.png';
import CalendarDisgust from '../assets/CalendarEmoji/CalendarDisgust.png';
import CalendarFear from '../assets/CalendarEmoji/CalendarFear.png';
import CalendarHappy from '../assets/CalendarEmoji/CalendarHappy.png';
import CalendarSad from '../assets/CalendarEmoji/CalendarSad.png';
import NeutralImage from '../assets/Neutral.png';

const moodToEmotionCode = {
  anger: 1,
  disgust: 2,
  fear: 3,
  happy: 4,
  sad: 5,
};

const PieChart = ({ date, showLabels: showLabelsProp }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 300 });
  const { journals } = useUser();
  const [moodStats, setMoodStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Determine the date to use (default to today)
  const today = new Date();
  const dateString = date
    ? new Date(date).toISOString().slice(0, 10)
    : today.toISOString().slice(0, 10);

  // Fetch mood stats for the journal entry of the given date
  useEffect(() => {
    const fetchMoodStats = async () => {
      setLoading(true);
      setMoodStats(null);
      // Find journal for the date
      const journal = journals.find(j => (j.date || '').slice(0, 10) === dateString);
      if (journal) {
        try {
          const response = await api.get(`/journals/${journal.id}/`);
          setMoodStats(response.data.moodStats || null);
        } catch (err) {
          setMoodStats(null);
        }
      } else {
        setMoodStats(null);
      }
      setLoading(false);
    };
    fetchMoodStats();
  }, [journals, dateString]);

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

  // Prepare chart data
  const getChartData = () => {
    if (!moodStats) return [
      { name: 'Happiness', value: 20 },
      { name: 'Anger', value: 20 },
      { name: 'Fear', value: 20 },
      { name: 'Disgust', value: 20 },
      { name: 'Sadness', value: 20 },
    ];
    return [
      { name: 'Happiness', value: parseFloat(moodStats.percentHappiness.toFixed(2)) },
      { name: 'Anger', value: parseFloat(moodStats.percentAnger.toFixed(2)) },
      { name: 'Fear', value: parseFloat(moodStats.percentFear.toFixed(2)) },
      { name: 'Disgust', value: parseFloat(moodStats.percentDisgust.toFixed(2)) },
      { name: 'Sadness', value: parseFloat(moodStats.percentSadness.toFixed(2)) },
    ];
  };

  // Get emotion code for dominant mood
  const getDominantEmotionCode = () => {
    if (!moodStats || !moodStats.dominantMood) return 0; // neutral
    return moodToEmotionCode[moodStats.dominantMood.toLowerCase()] || 0;
  };

  const data = getChartData();
  const emotionCode = getDominantEmotionCode();
  const showLabels = showLabelsProp !== undefined ? showLabelsProp : !!moodStats;

  // --- D3 chart logic (unchanged) ---
  const { width, height } = dimensions;
  const margin = 15;
  const chartWidth = width - margin * 2;
  const chartHeight = height - margin * 2;
  const radius = Math.min(chartWidth, chartHeight) / 2;

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const emotionImages = {
    0: NeutralImage, // Neutral/default state
    1: CalendarAngry,
    2: CalendarDisgust,
    3: CalendarFear,
    4: CalendarHappy,
    5: CalendarSad
  };

  // Use neutral image for default state or when no labels are shown
  const currentEmotionImage = showLabels 
    ? (emotionImages[emotionCode] || CalendarHappy)
    : NeutralImage;

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

  if (loading) {
    return <div className="card pie-chart-container" ref={containerRef} style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%'}}>Loading...</div>;
  }

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
                  fill={nameColors[slice.data.name] || '#FEF6BE'}
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
                {showLabels && (
                  <>
                    <text
                      transform={`translate(${labelArcGenerator.centroid(slice)})`}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={isHovered ? baseFontSize : baseFontSize}
                      fontWeight="bold"
                      fill="var(--color-dark)"
                      dy={-12}
                      style={{
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
                        transition: 'all 0.2s ease-in-out',
                        pointerEvents: 'none',
                        opacity: hoveredIndex !== null && !isHovered ? 0.6 : 1
                      }}
                    >
                      {slice.data.name}
                    </text>
                  </>
                )}
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
