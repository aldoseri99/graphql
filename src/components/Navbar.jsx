import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "/lumon.png"; // adjust path if needed

export const Navbar = ({ onLogout }) => {
  const { pathname } = useLocation();
  if (pathname === "/login") return null;

  return (
    <header className="lumonNav">

      <div className="lumonNavLeft">
    <nav className="lumonLinks">
      <Link to="/" className={pathname === "/" ? "active" : ""}>
        Home
      </Link>
      <Link to="/profile" className={pathname === "/profile" ? "active" : ""}>
        Profile
      </Link>
      <Link to="/projects" className={pathname === "/projects" ? "active" : ""}>
        Projects
      </Link>
    </nav>
  </div>

  {/* CENTER */}
  <div className="lumonNavCenter">
    <img src={logo} alt="Lumon Logo" className="lumonCenterLogo" />
  </div>

  {/* RIGHT */}
  <div className="lumonNavRight">
    <button className="lumonLogout" onClick={onLogout}>
      Switch to Outie
    </button>
  </div>

    
        
    </header>
  );
}
