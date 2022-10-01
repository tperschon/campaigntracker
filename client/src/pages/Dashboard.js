import React from "react";
import Auth from '../utils/Auth';
import { Link } from "react-router-dom";

// run GET_USER_CAMPAIGN query
//assign it to a variable
//run a map method on the response variable



//add join campaign. add jcode to add user

const DashboardPage = () => {
  const campaigns = []; 
  return (
  <>
    {
      Auth.loggedIn()?(
        <div className="container">
        {/* Return differently if logged in vs not. */}
        <h3>List of Campaigns dashboard</h3>

        {campaigns.map((campaign) => (<li>{campaign}</li>))}
      
      </div>
      ):(
        // Again, placeholder CSS
        <div className="home-container">
          {/* Return Lists of campaigns and characters. */}
          <h3>Please <Link className="context-link" to="/login">login</Link> to view campaigns!</h3>
        </div>)
    }   
  </>
  )
};


export default DashboardPage;