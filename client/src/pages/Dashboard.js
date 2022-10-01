import React from "react";
import Auth from '../utils/Auth';
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_USER_CAMPAIGNS } from "../utils/queries";
import CampaignCard from "../components/CampaignCard/index"


// run GET_USER_CAMPAIGN query
//assign it to a variable
//run a map method on the response variable

//add join campaign. add jcode to add user

const Dashboard = () => {
  const { data: { username, _id: id }} = Auth.getProfile();

  const {loading, error, data} = useQuery(GET_USER_CAMPAIGNS, {variables: {userId: id}});

  if (loading) {
    return <div>Leading...</div>;
  }

  if (error) {
    console.error(error);
  }
  console.log(data)
  return (
    <div className='container'>
      <div className="join-create-container">
        
        <div className="redirect-container ">
          <a className='redirect' href='/create'>Create A New Campaign</a>
        </div>

        <div className="redirect-container">
          <a className='redirect' href='/join'>Join A Campaign</a>
        </div>
      </div>
      
      <div className='campaign-container'>
        {data.getUserCampaigns.map((c, i)=> <CampaignCard campaign={c} key={i}/>)}
      </div>
    </div>
  )
}
  
  

  // return (
  // <>
  //   {
  //     Auth.loggedIn()?(
  //       <div className="container">
  //       {/* Return differently if logged in vs not. */}
  //       <h3 className='dashboard-header'>List of Campaigns dashboard</h3>
        
  //       <div className='dashboard-main-container heading-container'>
          
  //         <div className='campaign-name-container'>
  //           <label>Campaign Name:</label>
  //         </div>

  //       </div>

  //       {/* {campaigns.map((campaign) => (<li>{campaign}</li>))} */}
      
  //     </div>
  //     ):(
  //       // Again, placeholder CSS
  //       <div className="home-container">
  //         {/* Return Lists of campaigns and characters. */}
  //       </div>)
  //   }   
  // </>
  // )



export default Dashboard;