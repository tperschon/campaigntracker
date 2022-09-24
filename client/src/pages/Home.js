import React from "react";
import Auth from '../utils/Auth'

const Home = () => {
  if (Auth.loggedIn()) {
    return (
      <div className="container">
        {/* Return differently if logged in vs not. */}
      </div>
    )
  }
  return (
    // Again, placeholder CSS
    <div className="container">
      {/* Return Lists of campaigns and characters. */}
    </div>
  )
}

export default Home;