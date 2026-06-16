import { useEffect, useRef } from "react";
import { replace, useNavigate } from "react-router-dom";
import "./SeveredTransition.css";

export const SeveredTransition = ({ logged, setLogged }) => {
  const navigate = useNavigate();
  const audioRef = useRef(null);

  useEffect(() => {
    if (logged != 1) {
      navigate("/", { replace: true });
    }
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.5;
    audio.play().catch(() => {});

    // redirect after 6 seconds
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 6000);
    setLogged(2)

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="severedScreen">
      <p className="severedText">Proceeding to the severed level…</p>

      <audio ref={audioRef}>
        <source src="/loginAudio.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
};
