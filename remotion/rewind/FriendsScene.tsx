/* eslint-disable @next/next/no-img-element */
import React, { useMemo, useRef } from 'react'
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface FriendsSceneProps {
  message: string;
  emoji: string;
  data: {
    friends: {
      name: string;
      cover: string;
    }[];
  };
}
export default function FriendsScene({ message, emoji, data }: FriendsSceneProps) {
  const friends = useMemo(() => data.friends.map((friend, index) => ({  
    name: friend.name,
    cover: friend.cover,
  })), [data.friends]);
  
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
        gap: 20,
      }}>
        {friends.map((friend, index) => {
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
              borderRadius: 10,
              padding: 10,
            }}>
            <img 
              key={index} 
              src={friend.cover} 
              alt="memory" 
              style={{ 
                width: 200, 
                height: 200, 
                objectFit: "cover", 
                borderRadius: "100%",
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
                {friend.name}
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
