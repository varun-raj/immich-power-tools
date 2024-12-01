/* eslint-disable @next/next/no-img-element */
import React, { useMemo, useRef } from 'react'
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface AlbumsSceneProps {
  message: string;
  emoji: string;
  data: {
    albums: {
      name: string;
      cover: string;
    }[];
  };
}
export default function AlbumsScene({ message, emoji, data }: AlbumsSceneProps) {
  const albums = useMemo(() => data.albums.map((album, index) => ({  
    name: album.name,
    cover: album.cover,
  })), [data.albums]);
  
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
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 20,
      }}>
        {albums.map((album, index) => {
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
            <div key={index} style={{
              border: "1px solid lightblue",
              borderRadius: 10,
              padding: 10,
            }}>
            <img 
              key={index} 
              src={album.cover} 
              alt="memory" 
              style={{ 
                width: 200, 
                height: 200, 
                objectFit: "cover", 
                borderRadius: 10,
                margin: 10,
                transform: `scale(${scale})`,
              }} 
            />
            <p style={{
              fontSize: 20,
              textAlign: "center",
              marginTop: 10,  
              color: "lightblue",
            }}>
              {album.name}
            </p>
            </div>
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
