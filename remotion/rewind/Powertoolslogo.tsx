import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

interface PowertoolsLogoProps {
  size?: number;
}

export default function PowertoolsLogo({ size = 379 }: PowertoolsLogoProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Create staggered animations for each rectangle
  const scale1 = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 12 }
  });

  const scale2 = spring({
    frame: frame - 5,
    fps,
    from: 0,
    to: 1,
    config: { damping: 12 }
  });

  const scale3 = spring({
    frame: frame - 10,
    fps,
    from: 0,
    to: 1,
    config: { damping: 12 }
  });

  const scale4 = spring({
    frame: frame - 15,
    fps,
    from: 0,
    to: 1,
    config: { damping: 12 }
  });

  const scale5 = spring({
    frame: frame - 20,
    fps,
    from: 0,
    to: 1,
    config: { damping: 12 }
  });

  // Text animation
  const textOpacity = spring({
    frame: frame - 25,
    fps,
    from: 0,
    to: 1,
    config: { damping: 12 }
  });

  // Rewind text animations - bouncing and color changing effect
  const rewindRotation = interpolate(
    frame,
    [0, 30],
    [360, 0],
    {
      extrapolateRight: 'clamp'
    }
  );

  const bounceY = spring({
    frame: frame - 25,
    fps,
    from: -20,
    to: 0,
    config: { mass: 0.5, damping: 4 }
  });

  const hue = interpolate(
    frame % 120,
    [0, 60, 120],
    [0, 180, 360]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={size} viewBox="0 0 379 379" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect 
          x="48" 
          y="34" 
          width="283" 
          height="94.7184" 
          rx="20" 
          fill="#FA2921"
          transform={`scale(${scale1})`}
          transform-origin="center"
        />
        <rect 
          x="49.1551" 
          y="142.58" 
          width="97.0286" 
          height="93.5633" 
          rx="20" 
          fill="#ED79B5"
          transform={`scale(${scale2})`}
          transform-origin="center"
        />
        <rect 
          x="233.971" 
          y="250.004" 
          width="97.0286" 
          height="94.7184" 
          rx="20" 
          fill="#18C249"
          transform={`scale(${scale3})`}
          transform-origin="center"
        />
        <rect 
          x="160.045" 
          y="142.58" 
          width="170.955" 
          height="93.5633" 
          rx="20" 
          fill="#1E83F7"
          transform={`scale(${scale4})`}
          transform-origin="center"
        />
        <rect 
          x="48" 
          y="250.004" 
          width="170.955" 
          height="94.7184" 
          rx="20" 
          fill="#FFB400"
          transform={`scale(${scale5})`}
          transform-origin="center"
        />
      </svg>
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: textOpacity,
        marginTop: 20
      }}>
        <h1 style={{
          color: 'white',
          margin: 0,
          fontSize: 32
        }}>
          Immich Power Tools
        </h1>
        <h2 style={{
          color: `hsl(${hue}, 100%, 50%)`,
          margin: '10px 0 0 0',
          fontSize: 40,
          transform: `rotate(${rewindRotation}deg) translateY(${bounceY}px)`,
          transformOrigin: 'center',
          textShadow: '0 0 10px rgba(255,255,255,0.5)',
          fontWeight: 'bold',
          letterSpacing: '2px'
        }}>
          Rewind
        </h2>
      </div>
    </div>
  );
}
