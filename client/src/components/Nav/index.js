import React from "react";
import Auth from "../../utils/auth";
import { Link } from "react-router-dom";

// Nav component

function Nav() {

  // Navigation header.

  function showNavigation() {
    if (Auth.loggedIn()) {
      return (
        <ul className="flex-row">
          {/* If logged in, links to? */}
        </ul>
      )
    }
  }
}