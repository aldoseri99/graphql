import { useEffect, useRef } from "react";

export const LumonAudio = () => {
  const audioRef = useRef(null);
  const fadeRef = useRef(null);

  const fadeVolume = (audio, target, duration) => {
    if (!audio) return;

    if (fadeRef.current) {
      clearInterval(fadeRef.current);
    }

    const start = audio.volume;
    const diff = target - start;
    const steps = Math.max(1, Math.floor(duration / 50));

    let currentStep = 0;

    fadeRef.current = setInterval(() => {
      currentStep++;

      audio.volume = Math.min(
        1,
        Math.max(0, start + (diff * currentStep) / steps)
      );

      if (currentStep >= steps) {
        audio.volume = target;
        clearInterval(fadeRef.current);
        fadeRef.current = null;
      }
    }, 50);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const BASE_VOLUME = 0.25;

    audio.loop = true;
    audio.volume = 0;

    audio.play().catch(() => {});

    fadeVolume(audio, BASE_VOLUME, 1500);

    const duck = (e) => {
      fadeVolume(
        audio,
        e.detail?.to ?? 0.05,
        e.detail?.ms ?? 500
      );
    };

    const restore = (e) => {
      fadeVolume(
        audio,
        BASE_VOLUME,
        e.detail?.ms ?? 700
      );
    };

    window.addEventListener("lumon:duck", duck);
    window.addEventListener("lumon:restore", restore);

    return () => {
      if (fadeRef.current) {
        clearInterval(fadeRef.current);
      }

      window.removeEventListener("lumon:duck", duck);
      window.removeEventListener("lumon:restore", restore);
    };
  }, []);

  return (
    <audio ref={audioRef}>
      <source src="/lumon.mp3" type="audio/mpeg" />
    </audio>
  );
};