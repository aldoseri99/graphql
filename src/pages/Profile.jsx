import { useEffect, useState } from "react";
import "./Profile.css";
import { WellnessSession } from "../components/WellnessSession";
import { SplashScreen } from "../components/SplashScreen";
import { ProfileAudio } from "../components/ProfileAudio";

export const Profile = ({ token, sessionOpen, setSessionOpen }) => {
  const [user, setUser] = useState("");
  const [prog, setProg] = useState("");
  useEffect(() => {
    getUser(token);
  }, [token]);
  const getUser = async (token) => {
    const res = await fetch(
      "https://learn.reboot01.com/api/graphql-engine/v1/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `{ user { id login email createdAt attrs updatedAt }
           progress { id  createdAt  grade  isDone eventId  objectId  object{ name type } event { id }  }}`,
        }),
      },
    );
    const json = await res.json();
    setProg(json.data?.progress);
    setUser(json.data?.user[0]);
  };

  function formatDate(isoString) {
    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
  function calculateAge(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();

    const hasHadBirthdayThisYear =
      today.getMonth() > dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

    if (!hasHadBirthdayThisYear) {
      age--;
    }

    return age;
  }

  function formatSeveranceName(firstName = "", lastName = "") {
    const cleaned = (lastName || "").trim().replace(/^al[-\s]?/i, "");
    const initial = cleaned ? cleaned[0].toUpperCase() : "";
    return firstName
      ? `${firstName} ${initial ? initial + "." : ""}`.trim()
      : user?.login || "";
  }
  const OUTIE_FACTS = [
    "Your Outie is a friend to children and to the elderly and the insane",
    "Your Outie likes the sound of radar",
    "Your Outie is kind",
    "Your Outie is generous",
    "Your Outie is splendid and can swim gracefully and well",
    "Your Outie is strong and helped someone lift a heavy object",
    "Your Outie likes films and owns a machine that can play them",
    "Your Outie has brightened people’s days by merely smiling",
    "Your Outie won a game two weeks ago",
    "Your Outie values water",
    "A photo of your Outie with a trophy was once in a newspaper",
    "Your Outie has no fear of muggers or knaves",
    "Your outie has gone 2 whole weeks without leaving the house.",
  ];

  const [factIndex, setFactIndex] = useState(0);
  const [factPulse, setFactPulse] = useState(false);

  const [profilSplash, setProfilSplash] = useState(false);

  useEffect(() => {
    const flag = sessionStorage.getItem("profilSplash");
    if (flag === "1") {
      setProfilSplash(true);

      const timer = setTimeout(() => {
        setProfilSplash(false);
        sessionStorage.removeItem("profilSplash");
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setFactPulse(true);
      setFactIndex((i) => (i + 1) % OUTIE_FACTS.length);
      setTimeout(() => setFactPulse(false), 220); // tiny pulse animation
    }, 4000);

    return () => clearInterval(id);
  }, []);

  if (!user) return <p className="profileEmpty">Loading…</p>;

  const a = user.attrs || {};

  const since = prog.filter((p) => p?.objectId && p.objectId === 100236);

  sessionStorage.setItem("postLoginSplash", "1");
  sessionStorage.setItem("projectSplash", "1");

  return (
    <main className="wellnessPage">
      <ProfileAudio />
      {profilSplash && (
        <SplashScreen splashText="You are safe here. Your Outie is doing very well." />
      )}
      {sessionOpen && (
        <WellnessSession
          user={user}
          OUTIE_FACTS={OUTIE_FACTS}
          onClose={() => setSessionOpen(false)}
        />
      )}
      <header className="wellnessHeader">
        <div className="wellnessBadge">
          <span className="wellnessDot" />
          <span className="wellnessWordmark">WELLNESS SESSION</span>
        </div>

        <div className="wellnessTitleRow">
          <div>
            <h1 className="wellnessTitle">
              {formatSeveranceName(a.firstName, a.lastName)}{" "}
              <span className="empId">• MDR-{user.id}</span>
            </h1>

            <p className="wellnessSub">Personnel File • @{user.login}</p>

            <p className="wellnessMeta">
              Employee Since • {formatDate(since[0].createdAt)}
            </p>
          </div>

          <div className="wellnessPill">Macrodata Refinement</div>
        </div>
      </header>
      {/* Wellness intro (Ms. Casey style) */}
      {/* <section
        className="card wellnessIntro"
        aria-label="Wellness Introduction"
      >
        <p className="introLabel">Wellness Session Transcript</p>

        <p className="introText">
          All right, {a.firstName || user.login}. What I'd like to do is share
          with you some facts about your outie. Because your outie is an
          exemplary person, these facts should be very pleasing.
        </p>

        <p className="introText">
          Try to enjoy each equally. These facts are not to be shared outside
          this room. But for now, they're yours to enjoy.
        </p>
      </section> */}

      <section className="wellnessTop">
        {/* LEFT: Profile details */}
        <div className="card wellnessCard">
          <h3 className="cardTitle">Employee Details</h3>

          <div className="kvGrid">
            <div className="kv">
              <span>Innie Name</span>
              <b>{formatSeveranceName(a.firstName, a.lastName)}</b>
            </div>

            <div className="kv">
              <span>Outie Name</span>
              <b>{`${a.firstName || "—"} ${a.lastName || ""}`.trim()}</b>
            </div>

            <div className="kv">
              <span>Username</span>
              <b>@{user.login}</b>
            </div>

            <div className="kv">
              <span>Email</span>
              <b>{user.email || a.email || "—"}</b>
            </div>

            <div className="kv">
              <span>Age</span>
              <b>{a.dateOfBirth ? calculateAge(a.dateOfBirth) : "—"}</b>
            </div>

            <div className="kv">
              <span>Date of Birth</span>
              <b>{a.dateOfBirth ? formatDate(a.dateOfBirth) : "—"}</b>
            </div>

            <div className="kv">
              <span>Country</span>
              <b>{a.country || "—"}</b>
            </div>

            <div className="kv">
              <span>Gender</span>
              <b>{a.genders || "—"}</b>
            </div>
          </div>
        </div>

        {/* RIGHT: Outie Facts */}
        <aside
          className="card wellnessCard wellnessFacts clickable"
          onClick={() => setSessionOpen(true)}
        >
          <div className="factsHeader">
            <div>
              <h3 className="cardTitle">Session Preview</h3>
              <p className="factsSub">Click to begin wellness session</p>
              <p className="factsSub">This will be read to you calmly.</p>
            </div>
            <button
              className="startSessionBtn"
              onClick={() => setSessionOpen(true)}
            >
              Start Session
            </button>
          </div>

          <div className={`factsBody ${factPulse ? "pulse" : ""}`}>
            <p className="factsQuote">“{OUTIE_FACTS[factIndex]}.”</p>
          </div>

          <div className="factsDots" aria-hidden="true">
            {OUTIE_FACTS.slice(0, 8).map((_, i) => (
              <span
                key={i}
                className={`dot ${i === factIndex % 8 ? "active" : ""}`}
              />
            ))}
          </div>

          <p className="factsFineprint">
            Enter the session to hear your affirmations.
          </p>
        </aside>
      </section>
    </main>
  );
};
