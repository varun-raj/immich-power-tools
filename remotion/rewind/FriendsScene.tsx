import React from 'react';
import { Img, spring, useCurrentFrame, useVideoConfig } from 'remotion';

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
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      padding: "20px"
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        marginBottom: 40,
        opacity: spring({
          frame,
          fps,
          from: 0,
          to: 1,
          config: {
            mass: 0.5,
            damping: 20,
          }
        })
      }}>
        <span style={{ 
          fontSize: 80,
          transform: `translateY(${spring({
            frame,
            fps,
            from: 0,
            to: -10,
            config: {
              mass: 0.3,
              damping: 10,
              stiffness: 100
            }
          })}px)`
        }}>{emoji}</span>
        <h1 style={{
          fontSize: 50,
          color: "white",
          textAlign: "center",
          margin: 0,
          maxWidth: "80%",
          textShadow: "2px 2px 4px rgba(0,0,0,0.2)"
        }}>
          {message}
        </h1>
      </div>

      <div style={{
        display: "flex",
        gap: 30,
        justifyContent: "center",
        width: "100%"
      }}>
        {data.friends.map((friend, index) => {
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
            to: index % 2 === 0 ? 8 : -8,
            config: {
              mass: 0.5,
              damping: 20,
              stiffness: 80
            },
          });

          return (
            <div
              key={friend.name}
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                opacity: scale
              }}
            >
              <Img
                src={friend.cover}
                alt={friend.name}
                style={{
                  width: 200,
                  height: 200,
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: "8px solid white",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                }}
              />
              <p style={{
                color: "white",
                fontSize: 24,
                textAlign: "center",
                margin: "15px 0",
                fontWeight: "bold",
                textShadow: "1px 1px 2px rgba(0,0,0,0.2)"
              }}>
                {friend.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
