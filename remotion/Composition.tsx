import { AbsoluteFill, useCurrentFrame, interpolate, staticFile, Audio } from "remotion";
import WelcomeScene from "./rewind/WelcomeScene";
import CountryScene from "./rewind/CountryScene";
import MemoriesScene from "./rewind/MemoriesScene";
import AlbumsScene from "./rewind/AlbumScene";
import FriendsScene from "./rewind/FriendsScene";

export interface Scene {
  message: string;
  type: string;
  emoji: string;
  data: any;
}
export const IntroComposition = ({  scenes }: { scenes: Scene[] }) => {
  const frame = useCurrentFrame();
  const screenDuration = 120;
  const sceneIndex = Math.floor(frame / screenDuration) % scenes.length;
  const scene = scenes[sceneIndex];

  const renderScene = () => {
    switch (scene.type) {
      case "WELCOME":
        return <WelcomeScene message={scene.message} emoji={scene.emoji} />;
      case "COUNTRY":
        return <CountryScene message={scene.message} emoji={scene.emoji} data={scene.data} />;
      case "MEMORY":
        return <MemoriesScene message={scene.message} emoji={scene.emoji} data={scene.data} />;
      case "ALBUM":
        return <AlbumsScene message={scene.message} emoji={scene.emoji} data={scene.data} />;
      case "FRIEND":
        return <FriendsScene message={scene.message} emoji={scene.emoji} data={scene.data} />;
      default:
        return <WelcomeScene message={scene.message} emoji={scene.emoji} />;
    }
  }

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        transition: "background-color 1s ease",
        fontFamily: "sans-serif",
      }}
    >
      {renderScene()}
      <Audio src={staticFile("audio/rewind.mp3")} />
    </AbsoluteFill>
  );
};