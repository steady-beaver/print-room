import React from "react";
import { useHistory } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const history = useHistory();

  return (
    <>
      <div id="message">
        <h1>Customize your room</h1>
        <h4>With our awesome posters</h4>
      </div>
      <div id="actions">
        <button className="btn primary-blue-btn">Search</button>
        <button className="btn secondary-blue-btn" onClick={(e) => history.push("/login")} > Log in </button>
      </div>
      <div id="poster">
        <img src="./assets/rear-window-hitchcock-poster.png" alt="Rear window movie poster" />
      </div>
    </>
  );
};

export default LandingPage;
