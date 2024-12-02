import { AbsoluteFill, useCurrentFrame, interpolate, staticFile, Audio, Sequence } from "remotion";
import WelcomeScene from "./rewind/WelcomeScene";
import CountryScene from "./rewind/CountryScene";
import MemoriesScene from "./rewind/MemoriesScene";
import AlbumsScene from "./rewind/AlbumScene";
import FriendsScene from "./rewind/FriendsScene";
import PowertoolsLogo from "./rewind/Powertoolslogo";

export interface Scene {
  message: string;
  type: string;
  emoji: string;
  data: any;
}
export const IntroComposition = ({  scenes }: { scenes: Scene[] }) => {
  const frame = useCurrentFrame();
  const screenDuration = 120;

  const renderScene = (scene: Scene) => {
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
  };

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
      <Sequence name="Logo Intro" from={0} durationInFrames={screenDuration}>
        <div style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <PowertoolsLogo size={200} />
        </div>
      </Sequence>

      {scenes.map((scene, index) => (
        <Sequence
          key={index}
          name={`Scene ${index + 1} - ${scene.type}`}
          from={screenDuration * (index + 1)}
          durationInFrames={screenDuration}
        >
          {renderScene(scene)}
        </Sequence>
      ))}

      <Audio src={staticFile("audio/rewind.mp3")} />
    </AbsoluteFill>
  );
};