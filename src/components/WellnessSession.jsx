import { useEffect, useMemo, useState } from "react";

export const WellnessSession = ({ user, onClose }) => {
  const name = user?.attrs?.firstName || user?.login || "Employee";

  const SCRIPT = useMemo(
    () => [
      `All right, ${name}.`,
      "What I'd like to do is share with you some facts about your outie.",
      "Because your outie is an exemplary person, these facts should be very pleasing.",
      "Try to enjoy each equally.",
      "These facts are not to be shared outside this room.",
      "But for now, they're yours to enjoy.",
    ],
    [name],
  );

  const OUTIE_FACTS = useMemo(
    () => [
      "Your Outie is a friend to children and to the elderly and the insane",
      "Your Outie likes the sound of radar",
      "Your Outie is kind",
      "Your Outie is generous",
      "Your Outie is splendid and can swim gracefully and well",
      "Your Outie is strong and helped someone lift a heavy object",
      "Your Outie likes films and owns a machine that can play them",
      "Your Outie believes the Earth is flat",
      "Your Outie has brightened people’s days by merely smiling",
      "Your Outie won a game two weeks ago",
      "Your Outie keeps asking questions during movies",
      "A photo of your Outie with a trophy was once in a newspaper",
      "Your Outie has no fear of muggers or knaves",
      "Your outie has gone 2 whole weeks without leaving the house",
      `Your Outie holds a qualification in ${user.attrs.qualification}`,
      `Your Outie is ${user.attrs.jobtitle}`,
      "Your outie can parallel park in even the tiniest of spaces",
      "Your Outie waits until the last minute to study",
      "Your Outie is scared of their own shadow",
    ],
    [],
  );

  const [mode, setMode] = useState("script"); // "script" | "facts"
  const [index, setIndex] = useState(0);

  // fade state: "in" or "out"
  const [phase, setPhase] = useState("in");

  const fadeMs = 380;        // fade duration
  const lineHoldMs = 2700;   // how long each script line stays visible
  const factHoldMs = 4000;   // how long each fact stays visible

  const currentText =
    mode === "script" ? SCRIPT[index] : `${OUTIE_FACTS[index]}.`;

  // Progression engine with fade-out -> swap -> fade-in
  useEffect(() => {
    const hold = mode === "script" ? lineHoldMs : factHoldMs;

    // 1) hold text visible
    const t1 = setTimeout(() => {
      // 2) fade out
      setPhase("out");

      // 3) after fade-out, advance index and fade in
      const t2 = setTimeout(() => {
        setIndex((i) => {
          const next = i + 1;

          if (mode === "script") {
            // if finished script, switch to facts
            if (next >= SCRIPT.length) {
              setMode("facts");
              return 0; // start facts at 0
            }
            return next;
          }

          // facts loop
          return next % OUTIE_FACTS.length;
        });

        setPhase("in");
      }, fadeMs);

      return () => clearTimeout(t2);
    }, hold);

    return () => clearTimeout(t1);
  }, [index, mode, SCRIPT.length, OUTIE_FACTS.length]);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="wellnessOverlay" role="dialog" aria-modal="true">
      <button className="sessionClose" onClick={onClose}>
        End Session
      </button>

      <div className={`wellnessLine ${phase}`}>
        {currentText}
      </div>
    </div>
  );
};
































