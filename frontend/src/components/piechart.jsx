import React, { useState } from 'react';
import * as d3 from 'd3';

// Import calendar emoji images
import CalendarAngry from '../assets/CalendarEmoji/CalendarAngry.png';
import CalendarDisgust from '../assets/CalendarEmoji/CalendarDisgust.png';
import CalendarFear from '../assets/CalendarEmoji/CalendarFear.png';
import CalendarHappy from '../assets/CalendarEmoji/CalendarHappy.png';
import CalendarSad from '../assets/CalendarEmoji/CalendarSad.png';

const PieChart = ({ width, height, data, emotionCode = 4 }) => { // Sample default: 4 (happy)
  // Add margin for better spacing
  const margin = 15;
  const chartWidth = width - (margin * 2);
  const chartHeight = height - (margin * 2);
  
  // State for hover effects
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  // Define the radius of the pie chart with margin consideration
  const radius = Math.min(chartWidth, chartHeight) / 2;

  // Emotion code to image mapping (1-angry, 2-disgust, 3-fear, 4-happy, 5-sad)
  const emotionImages = {
    1: CalendarAngry,
    2: CalendarDisgust,
    3: CalendarFear,
    4: CalendarHappy,
    5: CalendarSad
  };

  // Get the current emotion image
  const currentEmotionImage = emotionImages[emotionCode] || CalendarHappy;

  // Create the pie generator
  const pieGenerator = d3.pie().value(d => d.value);

  // Generate the pie data
  const pieData = pieGenerator(data);

  // Create the arc generator
  const arcGenerator = d3.arc()
    .innerRadius(40)
    .outerRadius(radius);

  // Create arc generator for hover effect (slightly larger)
  const hoverArcGenerator = d3.arc()
    .innerRadius(40)
    .outerRadius(radius + 10);

  // Create arc generator for label positioning
  const labelArcGenerator = d3.arc()
    .innerRadius(radius * 0.8)
    .outerRadius(radius * 0.8);

  // Define a color scale
  const colorScale = d3.scaleOrdinal()
    .domain(data.map(d => d.name))
    .range(d3.schemeCategory10);

  // Define specific colors for emotion names
  const nameColors = {
    'Happiness': '#FEF6BE',
    'Anger': '#FFC5B7',
    'Fear': '#F1D5FF',
    'Disgust': '#FEF6BE',
    'Sadness': '#FEF6BE',
  };

  // Handle mouse enter
  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  /*
  // BACKEND INTEGRATION COMMENT:
  // To integrate with Django backend mood data, replace the sample data with:
  // 
  // const [moodData, setMoodData] = useState([]);
  // const [emotionCode, setEmotionCode] = useState(4); // Add this for emotion image
  // 
  // useEffect(() => {
  //   // Fetch mood stats from backend
  //   const fetchMoodData = async () => {
  //     try {
  //       const response = await api.get('/api/journal/latest/'); // Adjust endpoint as needed
  //       const moodStats = response.data.moodStats;
  //       
  //       // Transform backend data to chart format
  //       const chartData = [
  //         { name: 'Happiness', value: moodStats.percentHappiness },
  //         { name: 'Fear', value: moodStats.percentFear },
  //         { name: 'Sadness', value: moodStats.percentSadness },
  //         { name: 'Surprise', value: moodStats.percentSurprise },
  //         { name: 'Disgust', value: moodStats.percentDisgust },
  //         { name: 'Anger', value: moodStats.percentAnger },
  //       ].filter(item => item.value > 0); // Only show moods with values > 0
  //       
  //       setMoodData(chartData);
  //       
  //       // Set the dominant emotion code from backend (1-5)
  //       // You can get this from moodStats.dominantMoodCode or similar field
  //       setEmotionCode(response.data.dominantEmotionCode || 4);
  //       
  //     } catch (error) {
  //       console.error('Error fetching mood data:', error);
  //     }
  //   };
  //   
  //   fetchMoodData();
  // }, []);
  // 
  // Then pass moodData as the data prop and emotionCode as emotionCode prop
  */

  return (
    <svg width={width} height={height}>
      {/* Define circular clip path for the center image */}
      <defs>
        <clipPath id="circleClip">
          <circle cx="0" cy="0" r="40" />
        </clipPath>
      </defs>
      
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        {pieData.map((slice, index) => {
          const isHovered = hoveredIndex === index;
          
          return (
            <g key={index}>
              {/* Pie slice */}
              <path
                d={isHovered ? hoverArcGenerator(slice) : arcGenerator(slice)}
                fill={colorScale(slice.data.name)}
                stroke="var(--color-dark)"
                strokeWidth={isHovered ? 3 : 2}
                style={{
                  cursor: 'pointer',
                  opacity: hoveredIndex !== null && !isHovered ? 0.6 : 1,
                  transition: 'all 0.2s ease-in-out',
                  filter: isHovered ? 'brightness(1.1)' : 'none'
                }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              />
              
              {/* Value label (on top) */}
              <text
                transform={`translate(${labelArcGenerator.centroid(slice)})`}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={isHovered ? "14" : "12"}
                fontWeight="bold"
                fill="var(--color-dark)"
                dy="-8" // Move value up
                style={{
                  transition: 'all 0.2s ease-in-out',
                  pointerEvents: 'none',
                  opacity: hoveredIndex !== null && !isHovered ? 0.6 : 1
                }}
              >
                {slice.data.value}
              </text>
              
              {/* Name label (below value) */}
              <text
                transform={`translate(${labelArcGenerator.centroid(slice)})`}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={isHovered ? "11" : "10"}
                fontWeight="500"
                fill={nameColors[slice.data.name] || '#FEF6BE'}
                dy="8" // Move name down
                style={{ 
                  textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
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
        
        {/* Center emotion image - now circular */}
        <image
          href={currentEmotionImage}
          x="-40" // Half of width to center
          y="-40" // Half of height to center  
          width="80"
          height="80"
          clipPath="url(#circleClip)"
          style={{
            pointerEvents: 'none',
            transition: 'all 0.3s ease-in-out',
          }}
        />
      </g>
    </svg>
  );
};

export default PieChart;
