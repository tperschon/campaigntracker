import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { ADD_CAMPAIGN } from '../utils/mutations';

function NewCampaign() {

  const [formState, setCampaignName] = useState({name: ''});
  const [createCampaign, {loading, error}] = useMutation(ADD_CAMPAIGN);

  const campaignSubmit = async (event) => {
    event.preventDefault();
    const mutationResponse = await createCampaign({
      variables: {
        
        name: formState.name

      }
    });

    console.log(mutationResponse);    
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCampaignName({
      ...formState,
      [name]: value,
    });
  };

  return (
    // Stand-in CSS
    <div className='create-campaign-container'>
      <div className='input-container'>
        <div className='input-block'>
          <h2>Create Campaign</h2>
          <form className='create-campaign-form' onSubmit={campaignSubmit}>
            <div className='flex'>
              <div className='input-label'>
                <label htmlFor='name'>Campaign Name:</label>
              </div>
              <input
                className='input-field new-campaign-input'
                placeholder='New Campaign Name'
                name='name'
                type='text'
                onchange={handleChange}
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


  );
}

export default NewCampaign;

