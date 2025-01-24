import React from 'react'
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion'

interface WelcomeSceneProps {
  message: string;
  emoji: string;
}

export default function WelcomeScene({ message, emoji }: WelcomeSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    from: 0.5,
    to: 1,
    config: { damping: 12 }
  });

  const opacity = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 12 }
  });

  const rotation = spring({
    frame,
    fps,
    from: -5,
    to: 0,
    config: { damping: 12 }
  });

  const hue = interpolate(
    frame,
    [0, 60],
    [180, 240],
    { extrapolateRight: 'clamp' }
  );

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      transform: `scale(${scale})`,
      opacity: opacity,
      background: `radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)`,
      padding: 40,
      borderRadius: 20,
    }}>
      <p style={{  
        fontSize: 120, 
        marginTop: 40,
        marginBottom: 0,
        textAlign: "center",
        transform: `translateY(${Math.sin(frame / 30) * 10}px) rotate(${rotation}deg)`,
        textShadow: '0 0 20px rgba(255,255,255,0.5)',
      }}>
        {emoji}
      </p>
      <p style={{
        fontSize: 80,
        padding: "0 70px",
        color: `hsl(${hue}, 80%, 75%)`,
        marginTop: 20,
        textAlign: "center",  
        fontWeight: "bold",
        textShadow: '0 0 15px rgba(255,255,255,0.3)',
        letterSpacing: "2px",
        lineHeight: 1.2
      }}>
        {message}
      </p>
    </div>
  )
}
