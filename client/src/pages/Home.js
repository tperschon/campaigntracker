import React from "react";
import Auth from '../utils/Auth';
import { Link } from "react-router-dom";

const Home = () => {
  if (Auth.loggedIn()) {
    return (
      <div className="container">
        {/* Return differently if logged in vs not. */}
        <h3>Test</h3>
      </div>
    )
  }
  return (
    // Again, placeholder CSS
    <div className="home-container">
      {/* Return Lists of campaigns and characters. */}
      <h3>Please <Link className="context-link" to="/login">login</Link> to view campaigns!</h3>
    </div>
  )
};

export default Home;