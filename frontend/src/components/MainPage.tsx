import React, {JSX} from "react";
import "./MainPage.css";

const Home: React.FC = () : JSX.Element => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h2>Welcome to Certificate Management</h2>
        <p>
          This application allows you to create and manage certificates efficiently.
          You can issue new certificates, view existing ones, and ensure smooth workflow management.
        </p>
      </div>
    </div>
  );
};

export default Home;
