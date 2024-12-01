import React from 'react'
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

interface CountrySceneProps {
  message: string;
  emoji: string;
  data: any;
}

export default function CountryScene({ message, emoji, data }: CountrySceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const countries = data.countries as string[];

  // Message animation (takes 1 second to appear)
  const messageOpacity = interpolate(
    frame,
    [240, 260],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <p style={{ 
        fontSize: 40, 
        color: "lightblue", 
        marginTop: 40, 
        textAlign: "center", 
        padding: "0 20px",
        opacity: messageOpacity,
      }}>
        {message}
      </p>
      <div style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        gap: 10,
        width: "70%",
      }}>
        {countries.map((country: string, index: number) => {
          // Start countries after message (1 second) with 0.3 second delay between each
          const delay = (240) + (index * 0.1 * fps);
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
            <div key={country} style={{
              borderColor: "lightblue",
              borderRadius: "25px",
              height: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "lightblue",
              padding: "0px 20px",
              fontSize: 20,
              textAlign: "center",
              borderWidth: 1,
              borderStyle: "solid",
              transform: `scale(${scale})`,
              opacity: scale,
            }}>
              <div>
                <p style={{ margin: 0 }}>{country}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}
