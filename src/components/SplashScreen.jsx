import "./SplashScreen.css";
import logo from "/lumon.png";

export const SplashScreen = ({splashText}) => {
  return (
    <div className="splashScreen">
      <div className="splashGrid" />

      <div className="splashContent">
        <img src={logo} alt="Lumon" className="splashLogo" />
        {/* <p className="splashText">Devour Feculence</p> */}
        <p className="splashText">{splashText}</p>
      </div>
    </div>
  );
};
