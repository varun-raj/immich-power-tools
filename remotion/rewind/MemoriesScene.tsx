import React, { useMemo, useRef } from 'react'
import { Img, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface MemoriesSceneProps {
  message: string;
  emoji: string;
  data: {
    images: string[];
  };
}
export default function MemoriesScene({ message, emoji, data }: MemoriesSceneProps) {
  const images = useMemo(() => data.images.map((image, index) => ({  
    src: image,
    rotate: (index % 2 === 0 ? 1 : -1) * 8,
  })), [data.images]);
  
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const messageOpacity = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: {
      mass: 0.5,
      damping: 20,
      stiffness: 100
    }
  });

  const messageY = spring({
    frame,
    fps,
    from: -20,
    to: 0,
    config: {
      mass: 0.5,
      damping: 20,
      stiffness: 100
    }
  });

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      padding: "20px 0"
    }}>
      <div style={{
        opacity: messageOpacity,
        transform: `translateY(${messageY}px)`,
      }}>
        <span style={{
          fontSize: 80,
          display: "block",
          textAlign: "center",
          marginBottom: 20
        }}>{emoji}</span>
        <p style={{
          fontSize: 50,
          padding: "0 40px",
          color: "white",
          marginBottom: 40,
          textAlign: "center",
          textShadow: "2px 2px 4px rgba(0,0,0,0.2)"
        }}>
          {message}
        </p>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 30,
        maxWidth: "90%",
        placeItems: "center",
      }}>
        {images.slice(0, 4).map((image, index) => {
          const delay = index * 5;
          const scale = spring({
            frame: frame - delay,
            fps,
            from: 0,
            to: 1,
            config: {
              mass: 0.8,
              damping: 15,
              stiffness: 100
            },
          });

          const rotation = spring({
            frame: frame - delay,
            fps,
            from: 0,
            to: image.rotate, // Use the stable rotation value directly
            config: {
              mass: 0.5,
              damping: 20,
              stiffness: 80
            },
          });

          return (
            <Img 
              key={index} 
              src={image.src} 
              alt="memory" 
              style={{ 
                width: 280,
                height: 280,
                objectFit: "cover",
                borderRadius: 15,
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                opacity: scale,
                boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                border: "8px solid white"
              }} 
            />
          )
        })}
      </div>
    </div>
  )
}
