import React from 'react'
import { Player } from '@remotion/player';

import { IntroComposition } from '../../remotion/Composition';

const scenes = [
  { message: "Welcome to Immich Replay Varun!" },
  { message: "2024! So much memories!" },
  { message: "You've been to 10 new countries!" },
  { message: "And 25 new cities!" },
  { message: "Here are some of my favorite memories from this year!" },
  { message: "The most memory filled album of all time!" },
  { message: "You made so much memory with Soundarapandian"},
]
export default function RewindPage() {
  return (
    <div>
      <Player
        component={IntroComposition}
        inputProps={{ scenes: scenes }}
        durationInFrames={scenes.length * 30}
        compositionWidth={1280}
        compositionHeight={720}
        fps={30}
        style={{
          width: 1280,
          height: 720,
        }}
        controls
      />
    </div>
  )
}
