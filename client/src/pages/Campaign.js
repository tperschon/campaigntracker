import React,{useState} from 'react' ;


// File name may need to be changed to be more accurate.

const Campaign = () => {
  const [campaignName, setCampaignName] = useState({
    name: '',
    notes:''
  })  
  const {name, notes} = campaignName

  const onChange = (event) => {
    setCampaignName((prevState) => ({
      ...prevState, 
      [event.target.name]: event.target.value
    }))
  }
  const onSubmit = (event) => {
    event.preventDefault();
    //This needs to be sent to the backend. Add Campaign Mutation
    const campaignDetails = {
      name, notes
    }
    //campaignDetails needs to be sent to the backend using addCampaign Mutation

  }
  return (
    // Stand-in CSS
    <form onSubmit={onSubmit} className="container">
      {/* Component for campaign list, characters list */}
      <div>Campaigns</div>
      
      <label >Campaign Name</label>
        <input value={name} name='name' onChange = {onChange}></input>
     
      <label>Campaign Notes</label>
        <textarea value={notes} name='notes' onChange = {onChange}></textarea>
      
      <button type='submit'>Save</button>
    </form>
  );
};

export default Campaign;