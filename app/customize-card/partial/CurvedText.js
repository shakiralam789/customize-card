import React from 'react';

export default function CurvedText({ text, radius = 120 }) {
  const characters = text.split('');
  const degree = 180 / characters.length;

  return (
    <div
      style={{
        position: 'relative',
        height: `${radius}px`,
        width: `${radius * 2}px`,
      }}
    >
      {characters.map((char, i) => {
        const rotate = i * degree - (degree * characters.length) / 2;
        return (
          <span
            key={i}
            style={{
              position: 'absolute',
              height: `${radius}px`,
              transform: `rotate(${rotate}deg)`,
              transformOrigin: `bottom center`,
              left: '50%',
              bottom: 0,
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
}
