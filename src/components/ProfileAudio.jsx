import { useEffect, useRef } from "react";

export const ProfileAudio = () => {
  const audioRef = useRef(null);
  const fadeRef = useRef(null);

  const fadeVolume = (
    audio,
    from,
    to,
    duration,
    onComplete
  ) => {
    if (!audio) return;

    if (fadeRef.current) {
      clearInterval(fadeRef.current);
    }

    const diff = to - from;
    const steps = Math.max(1, Math.floor(duration / 50));

    let currentStep = 0;

    fadeRef.current = setInterval(() => {
      currentStep++;

      audio.volume = Math.min(
        1,
        Math.max(0, from + (diff * currentStep) / steps)
      );

      if (currentStep >= steps) {
        audio.volume = to;

        clearInterval(fadeRef.current);
        fadeRef.current = null;

        if (onComplete) onComplete();
      }
    }, 50);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    window.dispatchEvent(
      new CustomEvent("lumon:duck", {
        detail: {
          to: 0.05,
          ms: 600,
        },
      })
    );

    audio.loop = true;
    audio.volume = 0;

    audio.play().catch(() => {});

    fadeVolume(audio, 0, 1, 1200);

    return () => {
      fadeVolume(
        audio,
        audio.volume,
        0,
        700,
        () => {
          audio.pause();
          audio.currentTime = 0;
        }
      );

      window.dispatchEvent(
        new CustomEvent("lumon:restore", {
          detail: {
            ms: 900,
          },
        })
      );
    };
  }, []);

  return (
    <audio ref={audioRef}>
      <source src="/wellness.mp3" type="audio/mpeg" />
    </audio>
  );
};