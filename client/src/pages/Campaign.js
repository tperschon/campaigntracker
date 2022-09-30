import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { QUERY_CAMPAIGN, GET_CAMPAIGN_NOTES } from '../utils/queries';
import { ADD_NOTE, REMOVE_NOTE } from '../utils/mutations';
import NoteCard from '../components/NoteCard';

// File name may need to be changed to be more accurate.

const Campaign = async (props) => {
  const [campaign] = useQuery(QUERY_CAMPAIGN);
  const [notes] = useQuery(GET_CAMPAIGN_NOTES);
  const [addNote] = useMutation(ADD_NOTE);
  const [removeNote] = useMutation(REMOVE_NOTE);

  return (
    // Stand-in CSS
    <div className="campaign container">
      <div className="notes container">
        {notes.map(note => <NoteCard note/>)}
      </div>
      <div className="players container">
        <ul>
          {campaign.players.map(player => <li>{player.username}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default Campaign;