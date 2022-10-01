import React from "react";
import Auth from '../utils/Auth';
import { Link } from "react-router-dom";


// run GET_USER_CAMPAIGN query
//assign it to a variable
//run a map method on the response variable


const Home = () => {
  const campaigns = []; 
  return (
  <>
    {
      Auth.loggedIn()?(
        <div className="home">
        {/* Return differently if logged in vs not. */}
        

          <div className='main-container'>
            <h3>Homepage Blog</h3>

            <div className='img-container'>

              <a href='https://www.dndbeyond.com/claim/source/one-dnd'target="_blank"><img src='/dragondd.jpeg' alt='D and D image of dragon'></img></a>
            
            </div>  
          </div>
      
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

export default Home;