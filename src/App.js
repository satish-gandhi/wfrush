import React, { useState } from "react";
import BusyTimes from "./components/Busytimes";
import Scheduler from "./components/Scheduler";
import Navigation from "./components/Navigation";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState(null);

  return (
    <div className="App" style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="logo-header">
        <div>
          <h1 className="ghostfounder-logo">GhostFounder</h1>
          <h2 className="text-xl text-gray-600 text-center">Whole Foods : Busy Hours</h2>
        </div>
      </div>
      <Navigation onPageChange={setCurrentPage} currentPage={currentPage} />
      {currentPage === 'busyTimes' && <BusyTimes />}
      {currentPage === 'scheduler' && <Scheduler />}
      {!currentPage && (
        <div className="w-full max-w-4xl mx-auto p-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600">Please select an option above to get started.</p>
          </div>
        </div>
      )}
      <footer className="footer text-black-900">
        <div>
          Made by Team GhostFounder
        </div>
      </footer>
    </div>
  );
}

export default App;
