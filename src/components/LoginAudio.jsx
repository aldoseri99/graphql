import { useEffect, useRef } from "react";

export const LoginAudio = () => {
  const audioRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.volume = 0.4;
      audio.play().catch(() => {});
    }, 5000); // ⏱️ 5 seconds delay


    return () => clearTimeout(timer);
  }, []);

  return (
    <audio ref={audioRef}>
      <source src="/loginAudio.mp3" type="audio/mpeg" />
    </audio>
  );
};
