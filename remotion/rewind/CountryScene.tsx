import React, { useMemo } from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface CountrySceneProps {
  message: string;
  emoji: string;
  data: {
    countries: string[];
  };
}

export default function CountryScene({ message, emoji, data }: CountrySceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const countries = useMemo(() => data.countries, [data.countries]);

  return (
    <div style={{
      display: "flex", 
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      gap: 40
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20
      }}>
        <span style={{
          fontSize: 100
        }}>
          {emoji}
        </span>
        <h1 style={{
          fontSize: 70,
          color: "white", 
          textAlign: "center",
          margin: 0
        }}>
          {message}
        </h1>
      </div>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 20,
        justifyContent: "center",
        maxWidth: "80%"
      }}>
        {countries.map((country, index) => {
          const delay = index * 5;
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
            <div
              key={country}
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                padding: "10px 20px",
                borderRadius: 15,
                transform: `scale(${scale})`,
                opacity: scale,
              }}
            >
              <span style={{ color: "white", fontSize: 24 }}>{country}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
