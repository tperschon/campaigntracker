import React from "react";
import Auth from "../../utils/auth";
import { Link } from "react-router-dom";

// Nav component

function Nav() {

  // Navigation header.

  function showNavigation() {
    if (Auth.loggedIn()) {
      return (
        // CSS classes are currently placeholder
        <ul className="flex-row">
          {/* If logged in, links to? 
              Guessing, campaigns--or characters? */}
        </ul>
      )
    } else {
      // if NOT logged in
      <ul className="flex-row">
        {/* Links to: Sign-up/Log-in *Can be one page, realistically.*
            Otherwise, nothing else? */}
      </ul>
    }
  }

  return (
    <header className="flex-row px-1">
      <h1>
        <Link to="/">
          Campaign Tracker
        </Link>
      </h1>

      <nav>
        {showNavigation()}
      </nav>
    </header>
  );
}

export default Nav;