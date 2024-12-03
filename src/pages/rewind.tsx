import { Player } from "@remotion/player";
import { IntroComposition } from "../../remotion/Composition";
import { scenes } from "../../remotion/Root";
import { Button } from "@/components/ui/button";

export default function RewindPage() {
  const playerProps = {
    component: IntroComposition,
    inputProps: { scenes },
    durationInFrames: scenes.length * 120,
    compositionWidth: 720,
    compositionHeight: 1280,
    fps: 30,
    controls: true,
    autoPlay: true
  };

  const renderButton = (className = "") => (
    <Button
      size="lg"
      className={`bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full font-semibold ${className}`}
    >
      Render My Rewind 🎬
    </Button>
  );

  return (
    <div className="min-h-screen text-white flex flex-col">
      <h1 className="text-4xl font-bold text-center mt-4">Your 2024 Rewind</h1>
      <div className="flex-1 flex flex-col lg:flex-row h-full p-4 gap-4">

        <div className="flex-1 relative bg-gray-900 rounded-lg shadow-xl">
          <Player
            {...playerProps}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        </div>
        <div className="flex-1 flex flex-col justify-center items-center p-4 lg:p-8 bg-gray-900 rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold mb-4">Ready to create your video?</h2>
          <p className="text-gray-300 mb-6 text-center">
            Click the button below to render your personalized 2024 rewind video!
          </p>
          {renderButton("w-full lg:w-auto px-8 py-4")}
        </div>
      </div>
    </div>
  );
}
