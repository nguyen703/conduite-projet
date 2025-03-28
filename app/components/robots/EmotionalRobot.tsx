import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import placeholderAnimation from "./animations/sad.json";

type Emotion = "neutral" | "happy" | "sad" | "angry" | "afraid" | "surprise";

interface EmotionalRobotProps {
  emotion: Emotion;
  size?: number;
}

export default function EmotionalRobot({
  emotion = "neutral",
  size = 150,
}: EmotionalRobotProps) {
  const [animate, setAnimate] = useState(false);

  // Trigger animation when emotion changes
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [emotion]);

  // Animation class for bouncing effect
  const animationClass = animate ? "animate-bounce" : "";

  return (
    <div className={`${animationClass} transition-all duration-300`}>
      <Lottie
        animationData={placeholderAnimation}
        loop={true}
        style={{ width: size, height: size }}
      />
    </div>
  );
}
