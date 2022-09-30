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
          {/* If logged in, links to? 
              Guessing, campaigns--or characters? */}
          <li>
            <a className="nav-link" href="/" onClick={() => Auth.logout()}>
              Logout
            </a>
          </li>
        </ul>
      );
    } else {
      // if NOT logged in
      return (
        <ul className="nav-list">
          <li><Link className="nav-link" to="/login">Login</Link></li>
          <li><Link className="nav-link" to="/signup">Sign-Up</Link></li>
        </ul>
      )
    }
  }

  return (
    // Header contains the nav element.
    <header className="flex-header">
      <div className="heading-container">
        <h1 className="main-heading">
          <Link className="main-heading-link" to="/">
            Campaign Tracker
          </Link>
        </h1>
      </div>
      <div className="nav-container">
        <nav>
          {showNavigation()}
        </nav>
      </div>
    </header>
  );
}

export default Nav;