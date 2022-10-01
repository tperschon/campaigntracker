import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { ADD_NOTE } from '../utils/mutations';
import { QUERY_CAMPAIGN, GET_CAMPAIGN_NOTES } from '../utils/queries';
import NoteCard from '../components/NoteCard';
import PlayerCard from '../components/PlayerCard';

// File name may need to be changed to be more accurate.

const Campaign = (props) => {
  const { id: campaignId} = useParams();
  const [formState, setFormState] = useState({ title: '', text: '' });
  const [addNote, { error: addNoteError }] = useMutation(ADD_NOTE);
  const handleChange = (event) => {
      const { name, value } = event.target;
      setFormState({
          ...formState,
          [name]: value,
      });
  };

  const { loading: campaignLoading, error: campaignError, data: campaignData } = useQuery(QUERY_CAMPAIGN, { variables: { campaignId: campaignId}});
  const { loading: notesLoading, error: notesError, data: notesData } = useQuery(GET_CAMPAIGN_NOTES, { variables: { campaignId: campaignId}});

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
        const noteAdded = await addNote({
            variables: {
                title: formState.title,
                text: formState.text,
                campaign: campaignId
            }
        });
        console.log(noteAdded);
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
          {campaignLoading ? ("Players loading") : campaignData.campaign.players.map((player, i) => <PlayerCard username={player.username} key={i} index={i}/>)}
        </h4>
      </div>
      <div className="notes container">
        <h2>Notes</h2>
        <ul>
          {notesLoading ? ("Notes Loading") : notesData.getCampaignNotes.map((note, i) => <NoteCard title={note.title} text={note.text} _id={note._id} key={i}/>)}
        </ul>
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
        </div>
      </div>
    </div>
  );
};

export default Campaign;