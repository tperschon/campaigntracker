import React, { useState } from 'react';
import Auth from '../utils/Auth';
import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { ADD_NOTE } from '../utils/mutations';
import { QUERY_CAMPAIGN, GET_CAMPAIGN_NOTES } from '../utils/queries';
import NoteCard from '../components/NoteCard';
import PlayerCard from '../components/PlayerCard';


const Campaign = (props) => {
  // get current user id
  const { data: { username, _id: id }} = Auth.getProfile();
  // get campaign's id from params
  const { id: campaignId } = useParams();
  // start off with no admin stuff
  let isAdmin = false;
  // extract state variable/setter, set state to blank to start
  const [formState, setFormState] = useState({ title: '', text: '' });
  // extract mutational function to add note as well as an error for it
  const [addNote, { error: addNoteError }] = useMutation(ADD_NOTE);
  // pull our data for the campaign and its notes
  const { loading: campaignLoading, error: campaignError, data: campaignData } = useQuery(QUERY_CAMPAIGN, { variables: { campaignId: campaignId } });
  const { loading: notesLoading, error: notesError, data: notesData } = useQuery(GET_CAMPAIGN_NOTES, { variables: { campaignId: campaignId } });
  // once we're done loading campaign data, check if current user is an admin of campaign and if they are, set isAdmin to true
  if(!campaignLoading) {
    if(campaignData.campaign.admins.map(admin => admin._id).includes(id)) isAdmin = true;
  };
  // keeps forms updated
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };
  // handles submit button to create a note
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await addNote({
        variables: {
          title: formState.title,
          text: formState.text,
          campaignId: campaignId
        }
      });
      window.location.assign(`/campaigns/${campaignId}`);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    // Stand-in CSS
    <div className="campaign container">
      <div className="players container">
        <h2>Players Participating</h2>
        <h4>
          {campaignLoading ? ("Players loading") : campaignData.campaign.players.map((player, i) => <PlayerCard username={player.username} key={i} index={i} />)}
        </h4>
      </div>
      <div className="notes container">
        <h2>Notes</h2>
        <ul>
          {(notesLoading) ? ("Notes Loading") : notesData.getCampaignNotes.map((note, i) => <NoteCard title={note.title} text={note.text} _id={note._id} key={i} isAdmin={isAdmin}/>)}
        </ul>
        {isAdmin ?(
        <div>
          <form className="noteform" onSubmit={handleFormSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Title"
              onChange={handleChange}
            /><br></br>
            <input
              type="text"
              name="text"
              placeholder="Text"
              onChange={handleChange}
            /><br></br>
            <input
              type="submit"
              value="Create Note"
            />
          </form>
        </div>):('')}
      </div>
    </div>
  );
};

export default Campaign;