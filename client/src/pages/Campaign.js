import React, { useState } from 'react';
import Auth from '../utils/Auth';
import { useMutation, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { QUERY_CAMPAIGN, GET_CAMPAIGN_NOTES } from '../utils/queries';
import { ADD_NOTE, REMOVE_NOTE } from '../utils/mutations';
import NoteCard from '../components/NoteCard';

// File name may need to be changed to be more accurate.

const Campaign = (props) => {
  const { id: campaignId} = useParams();
  const { data: { username, _id: userId }} = Auth.getProfile();
  const { loading: campaignLoading, error: campaignError, data: campaignData } = useQuery(QUERY_CAMPAIGN, { variables: { campaignId: campaignId}});
  const { loading: notesLoading, error: notesError, data: notesData } = useQuery(GET_CAMPAIGN_NOTES, { variables: { campaignId: campaignId}});
  if(!campaignLoading) console.log(campaignData.campaign.players)
  if(!notesLoading) console.log(notesData)
  //console.log(notesData)
  // console.log(notesData)
  // console.log(Auth.getUser())
  // const [campaign] = useQuery(QUERY_CAMPAIGN, { variables: { campaignId: props.campaign._id} });
  // console.log(campaign)
  // const [notes] = useQuery(GET_CAMPAIGN_NOTES);
  // const [addNote] = useMutation(ADD_NOTE);
  // const [removeNote] = useMutation(REMOVE_NOTE);

  return (
    // Stand-in CSS
    <div className="campaign container">
      {/* {(notesLoading || campaignLoading) ? } */}
      <div className="players container">
        <h2>Players Participating</h2>
        <ul>
          {campaignLoading ? ("Players loading") : campaignData.campaign.players.map(player => <li>{player.username}</li>)}
        </ul>
      </div>
      <div className="notes container">
        <h2>Notes</h2>
        <ul>
          {notesLoading ? ("Notes Loading") : ("Notes")}
        </ul>
      </div>
    </div>
  );
};

export default Campaign;