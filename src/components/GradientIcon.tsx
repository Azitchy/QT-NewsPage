import React from 'react';

export function GradientIcon({ 
  Icon, 
  size = 24, 
  normalColor = "currentColor",
  gradientColors = ['#A5DC53', '#5DD27A'], 
  className = "",
  ...props 
}) {
  const gradientId = React.useId();
  
  return (
    <div className={`icon-with-gradient relative inline-block ${className}`} {...props}>
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientColors[0]} />
            <stop offset="100%" stopColor={gradientColors[1]} />
          </linearGradient>
        </defs>
      </svg>
      
      <Icon 
        size={size} 
        className="icon-normal absolute inset-0"
        style={{ color: normalColor }}
      />
      
      <Icon 
        size={size} 
        className="icon-gradient"
        style={{ 
          stroke: `url(#${gradientId})`,
          fill: 'none'
        }}
      />
    </div>
  );
}