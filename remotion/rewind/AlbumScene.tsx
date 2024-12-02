import React, { useMemo } from 'react';
import { Img, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface AlbumSceneProps {
  message: string;
  emoji: string;
  data: {
    photos: number;
    albums: {
      name: string;
      cover: string;
    }[];
  };
}

export default function AlbumScene({ message, emoji, data }: AlbumSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const albums = useMemo(() => data.albums, [data.albums]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column", 
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      padding: "20px",
      gap: 40
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20
      }}>
        <span style={{ fontSize: 80 }}>{emoji}</span>
        <h1 style={{
          fontSize: 50,
          color: "white",
          textAlign: "center",
          margin: 0,
          maxWidth: "80%"
        }}>
          {message}
        </h1>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 20,
        width: "100%",
        maxWidth: 600
      }}>
        {albums.map((album, index) => {
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
              key={album.name}
              style={{
                transform: `scale(${scale})`,
                opacity: scale,
              }}
            >
              <Img
                src={album.cover}
                alt={album.name}
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 15,
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                }}
              />
              <p style={{
                color: "white",
                fontSize: 18,
                textAlign: "center",
                margin: "10px 0",
                fontWeight: "bold"
              }}>
                {album.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
