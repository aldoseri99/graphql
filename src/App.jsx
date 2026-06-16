import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { Projects } from "./pages/Projects";
import { Navbar } from "./components/Navbar";
import { LumonAudio } from "./components/LumonAudio";
import { WellnessSession } from "./components/WellnessSession";
import { SeveredTransition } from "./components/SeveredTransition ";

function App() {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [logged, setLogged] = useState(0);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    if (authChecked && !token) {
      navigate("/login", { replace: true });
    }
  }, [authChecked, token]);

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setToken(null);
    setLogged(0)
    navigate("/login");
  };
  const [sessionOpen, setSessionOpen] = useState(false);

  return (
    <div className="lumon-app">
      <div className="lumon-bg" />

      <div className="lumon-container">
        {token && <LumonAudio />}
        <Navbar onLogout={logout} />

        <Routes>
          <Route path="/" element={<Home token={token} />} />
          <Route path="/severed" element={<SeveredTransition logged={logged} setLogged = {setLogged} />}/>
          <Route
            path="/profile"
            element={<Profile token={token} sessionOpen={sessionOpen}setSessionOpen={setSessionOpen} />}
          />
          <Route path="/login" element={<Login setToken={setToken} setLogged = {setLogged}/>} />
          <Route path="/projects" element={<Projects token={token} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
