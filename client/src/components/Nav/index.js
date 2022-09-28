import React from "react";
import Auth from "../../utils/Auth";
import { Link } from "react-router-dom";

// Nav component

function Nav() {

  // Navigation header.

  function showNavigation() {
    if (Auth.loggedIn()) {
      return (
        // CSS classes are currently placeholder
        <ul className="nav-list">
          <li>Campaigns</li>
          {/* If logged in, links to? 
              Guessing, campaigns--or characters? */}
        </ul>
      )
    } else {
      // if NOT logged in
      return (
        <ul className="nav-list">
          <li><Link className="nav-link" to="/login">Login</Link></li>
          {/* Links to: Sign-up/Log-in *Can be one page, realistically.*
              Otherwise, nothing else? */}
        </ul>
      )
    }
  }

  return (
    // Header contains the nav element.
    <header className="flex-header">
      <h1 className="main-heading">
        <Link className="main-heading-link" to="/">
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