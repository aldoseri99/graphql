import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "/lumon.png";
import "./Login.css";
import { SplashScreen } from "../components/SplashScreen";

export const Login = ({ setToken, setLogged }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState(""); // ✅ add
  const [isLoading, setIsLoading] = useState(false); // ✅ optional but nice
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      navigate("/", { replace: true });
    }
  }, []);

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash)
    return <SplashScreen splashText="The Work is mysterious and important" />;

  const handleIdentifier = (e) => {
    setIdentifier(e.target.value);
    if (errMsg) setErrMsg(""); // ✅ clear on typing
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    if (errMsg) setErrMsg(""); // ✅ clear on typing
  };

  const submit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    setIsLoading(true);

    try {
      const token = btoa(identifier + ":" + password);
      const res = await fetch("https://learn.reboot01.com/api/auth/signin", {
        method: "POST",
        headers: {
          Authorization: `Basic ${token}`,
        },
      });

      if (!res.ok) {
        // ✅ Lumon message based on status
        if (res.status === 401 || res.status === 403) {
          setErrMsg("Access Denied • Credentials failed verification.");
        } else if (res.status >= 500) {
          setErrMsg("System Notice • Refinement network is unavailable.");
        } else {
          setErrMsg("Compliance Notice • Request rejected. Please retry.");
        }
        setIsLoading(false);
        return;
      }

      const jwt = await res.json();
      localStorage.setItem("token", jwt);
      setToken(jwt);
      setLogged(1);

      sessionStorage.setItem("postLoginSplash", "1");
      sessionStorage.setItem("projectSplash", "1");
      sessionStorage.setItem("profilSplash", "1");

      navigate("/severed", { replace: true, state: { log: true } });
    } catch (err) {
      setErrMsg("System Notice • Connection interrupted. Try again.");
      setIsLoading(false);
      return;
    }
  };

  return (
    <section className="login-page">
      <div className="login-bg-grid" />

      <div className="lumon-card" aria-label="Lumon Login">
        <img src={logo} alt="Lumon" className="login-logo" />

        <header className="lumon-header">
          <h1 className="lumon-title">Employee Access</h1>
          <p className="lumon-subtitle">You are exactly where you belong.</p>
        </header>

        {/* ✅ Lumon-style error notice */}
        {errMsg && (
          <div className="lumon-notice lumon-notice--error" role="alert">
            <span className="lumon-noticeDot" aria-hidden="true" />
            <span className="lumon-noticeText">{errMsg}</span>
          </div>
        )}

        <form className="login-form lumon-form" onSubmit={submit}>
          <div className="lumon-field">
            <label htmlFor="identifier">Username</label>
            <input
              name="identifier"
              id="identifier"
              onChange={handleIdentifier}
              value={identifier}
              type="text"
              autoComplete="username"
              placeholder="e.g. Marks S."
              aria-invalid={!!errMsg}
            />
          </div>

          <div className="lumon-field">
            <label htmlFor="password">Password</label>
            <input
              name="password"
              id="password"
              onChange={handlePassword}
              value={password}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={!!errMsg}
            />
          </div>

          <button className="lumon-btn" type="submit" disabled={isLoading}>
            {isLoading ? "Verifying…" : "Enter Refinement"}
          </button>

          <p className="lumon-fineprint">
            By continuing, you affirm your commitment to Kier Eagan and the
            ongoing refinement of the self.
          </p>
        </form>
      </div>
    </section>
  );
};
