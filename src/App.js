import React from "react";
import BusyTimes from "./components/Busytimes";
import "./App.css";

function App() {
  return (
    <div className="App" style={{ backgroundColor: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <BusyTimes />
      <footer className="footer">
        Made by Team GhostFounder
      </footer>
    </div>
  );
}

export default App;
