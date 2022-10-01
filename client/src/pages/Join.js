import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { JOIN_CAMPAIGN } from '../utils/mutations';

function Join () {

  const [formState, setCampaignjCode] = useState({jCode: ''});
  const [joinCampaign, {loading, error}] = useMutation(JOIN_CAMPAIGN);

  const joinSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log('hello')
      const mutationResponse = await joinCampaign({
        variables: {
          
          jCode: formState.jCode
  
        }
        
      });
      console.log('campaign data', mutationResponse.data)

      
      window.location.assign(`/campaigns/${mutationResponse.data.joinCampaign.campaign._id}`)
    
    
    } catch (error) {
      //console.log(mutationResponse.data)
      console.log('++++++++++ Join Error')
    }

    // console.log(mutationResponse);    
  };

  const handleChange = (event) => {
    const { jCode, value } = event.target;
    setCampaignjCode({
      ...formState,
      [jCode]: value,
    });
  };

  return (
    <div className='join-campaign-container'>
      <div className='input-container'>
        <div className='input-block'>
          <h2>Join A Campaign</h2>
          <form className='join-campaign-form' onSubmit={joinSubmit}>
            <div className='flex'>
              <div className='input-label'>
                <label htmlFor='name'>Campaign jCode:</label>
              </div>
              <input
                className='input-field jcode-input'
                placeholder='Campaign jCode'
                name='jCode'
                type='text'
                onChange={handleChange}
              />
            </div>
            <div className='flex'>
              <button className='submit-btn' type='submit'>Submit</button>
              {error && <p>{error.message}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Join;