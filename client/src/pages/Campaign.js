import React, { useState } from 'react';
import Auth from '../utils/Auth';
import { useMutation, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { QUERY_CAMPAIGN, GET_CAMPAIGN_NOTES } from '../utils/queries';
import { ADD_NOTE, REMOVE_NOTE } from '../utils/mutations';
import NoteCard from '../components/NoteCard';
import PlayerCard from '../components/PlayerCard';

// File name may need to be changed to be more accurate.

const Campaign = (props) => {
  const [formState, setFormState] = useState({ title: '', text: ''});
  const [addNote, { error: addNoteError }] = useMutation(ADD_NOTE);
  const [removeNote, { error: removeNoteError }]= useMutation(REMOVE_NOTE);
  const { id: campaignId} = useParams();
  const { data: { username, _id: userId }} = Auth.getProfile();
  const { loading: campaignLoading, error: campaignError, data: campaignData } = useQuery(QUERY_CAMPAIGN, { variables: { campaignId: campaignId}});
  const { loading: notesLoading, error: notesError, data: notesData } = useQuery(GET_CAMPAIGN_NOTES, { variables: { campaignId: campaignId}});

  return (
    // Stand-in CSS
    <div className="campaign container">
      <div className="players container">
        <h2>Players Participating</h2>
        <h4>
          {campaignLoading ? ("Players loading") : campaignData.campaign.players.map((player, i) => <PlayerCard username={player.username} key={i}/>)}
        </h4>
      </div>
      <div className="notes container">
        <h2>Notes</h2>
        <ul>
          {notesLoading ? ("Notes Loading") : notesData.getCampaignNotes.map((note, i) => <NoteCard title={note.title} text={note.text} key={i}/>)}
        </ul>
      </div>
    </div>
  );
};

export default Campaign;