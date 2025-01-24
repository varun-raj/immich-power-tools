import React from 'react';
import { Composition } from 'remotion';
import { IntroComposition, Scene } from './Composition';

export const scenes: Scene[] = [
  { message: "Welcome Varun!",
    type: "WELCOME",
    emoji: "👋",
    data: {},
    
  },
  {
    message: "2024! So much memories!",
    type: "TITLE",
    emoji: "📅",
    data: {
      photos: 100,
    },
    
  },
  {
    message: "You've been to 10 new countries!", type: "COUNTRY", emoji: "🌍", data: {
      countries: ["India", "USA", "Canada", "UK", "Australia", "New Zealand", "Singapore", "Malaysia", "Thailand", "Japan", "South Korea"],
    },

  },
  {
    message: "And 25 new cities!", type: "CITY", emoji: "🏙️", data: {
      cities: 25,
    },
    
  },
  {
    message: "Here are some of my favorite memories from this year!", type: "MEMORY", emoji: "🎉", data: {
      photos: 100,
      images: [
        "https://picsum.photos/id/237/200/300",
        "https://picsum.photos/id/238/200/300",
        "https://picsum.photos/id/239/200/300",
        "https://picsum.photos/id/240/200/300",
        "https://picsum.photos/id/241/200/300",
      ],
    },
    
  },
  {
    message: "The most memory filled album of all time!", type: "ALBUM", emoji: "📸", data: {
      photos: 100,
      albums: [
        {
          name: "Ladakh 2024",
          cover: "https://picsum.photos/id/400/200/300",
        },
        {
          name: "Kerala 2024",
          cover: "https://picsum.photos/id/401/200/300",
        },
        {
          name: "Mumbai 2024",
          cover: "https://picsum.photos/id/402/200/300",
        },
        {
          name: "Kerala 2023",
          cover: "https://picsum.photos/id/403/200/300",
        },
      ],
    },
    
  },
  {
    message: "You made so much memory with Soundarapandian", type: "FRIEND", emoji: "👯", data: {
      friends: [
        {
          name: "Soundarapandian",
          cover: "https://i.pravatar.cc/150?img=64",
        },
        {
          name: "Varun",
          cover: "https://i.pravatar.cc/150?img=65",
        },
      ],
    },
  },
  {
    message: "Lets see what 2025 has in store!", type: "END", emoji: "🚀", data: {
      
    },
  },
]
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Intro"
        defaultProps={{ scenes }}
        component={IntroComposition}
        durationInFrames={scenes.length * 120}
        fps={30}
        width={720}
        height={1280}
      />
    </>
  );
};