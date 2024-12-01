import React, { useMemo, useRef } from 'react'
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

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
    rotate: `${(index % 2 === 0 ? 1 : -1) * Math.random() * 10}deg`,
  })), [data.images]);
  
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const initialDelay = useRef(frame);
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      animation: "zoomIn 1s ease forwards",
    }}>
      <p style={{
        fontSize: 70,
        padding: "0 70px",
        color: "lightblue",
        marginTop: 40,
        textAlign: "center",
        transition: "opacity 1s ease",
      }}>
        {message}
      </p>
      <div style={{
        display: "flex",
        flexDirection: "row",
        gap: 10,
      }}>
        {images.map((image, index) => {
          const delay = (initialDelay.current) + (index * 0.1 * fps);
          const scale = spring({
            frame: frame - delay,
            fps,
            from: 0,
            to: 1,
            config: {
              damping: 12,
            },
          });

          return (
            <img 
              key={index} 
              src={image.src} 
              alt="memory" 
              style={{ 
                width: 200, 
                height: 200, 
                objectFit: "cover", 
                borderRadius: 10,
                margin: 10,
                rotate: image.rotate,
                transform: `scale(${scale})`,
              }} 
            />
          )
        })}
      </div>
    </div>
  )
}

// Add this CSS to your global styles or a CSS-in-JS solution
const styles = `
@keyframes zoomIn {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
`;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
