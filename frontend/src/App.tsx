import React, { useState, JSX } from "react";
import "./App.css";
import Table from "./components/Table";
import CreateCertificate from "./components/CreateCertificate";
import Navbar from "./components/Navbar";
import Home from "./components/MainPage";

type Page = "home" | "create" | "view";

const App: React.FC = () : JSX.Element => {
  const [activePage, setActivePage] = useState<Page>("home");

  const handleCertificateCreated = (): void => {
    setActivePage("view");
  };

  return (
    <div className="App">
      <Navbar setActivePage={setActivePage} />

      <div className="content">
        {activePage === "home" && <Home />}
        {activePage === "create" && <CreateCertificate onCreate={handleCertificateCreated} />}
        {activePage === "view" && <Table />}
      </div>
    </div>
  );
};

export default App;
