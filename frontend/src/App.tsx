// src/App.js
import React, { useState } from 'react';
import './App.css';
import Table from './components/Table';
import CreateCertificate from './components/CreateCertificate';
import Navbar from './components/Navbar';

function App() {
  const [isCreateCertificateVisible, setCreateCertificateVisible] = useState(false);
  const [isTableVisible, setTableVisible] = useState(false);

  const handleCreateToggle = () => {
    setCreateCertificateVisible(!isCreateCertificateVisible);
  };

  const handleTableToggle = () => {
    setTableVisible(!isTableVisible);
  };

  return (
    <div className="App">
      <Navbar /> {/* Add the Navbar here */}

      <h1>Certificate Management</h1>

      <div className="button-container">
        <button onClick={handleCreateToggle}>
          {isCreateCertificateVisible ? 'Hide Certificate Form' : 'Show Certificate Form'}
        </button>
        <button onClick={handleTableToggle}>
          {isTableVisible ? 'Hide Certificates Table' : 'Show Certificates Table'}
        </button>
      </div>

      <div className={`components-container ${isCreateCertificateVisible || isTableVisible ? 'showing-one' : ''}`}>
        {isCreateCertificateVisible && <CreateCertificate onCreate={handleTableToggle} />}
        {isTableVisible && <Table />}
      </div>
    </div>
  );
}

export default App;