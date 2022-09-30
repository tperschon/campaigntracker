import { gql } from '@apollo/client';

// Query for user, should only return the logged in user since it uses context
export const QUERY_USER = gql`
  query User {
    user {
      _id
      username
      email
      campaigns {
        _id
        name
      }
    }
  }`;

export const QUERY_CAMPAIGN = gql`
  query Campaign($campaignId: ID!) {
    campaign(campaignId: $campaignId) {
      _id
      name
      admins {
        username
      }
      players {
        username
      }
      jCode
    }
  }`;

export const GET_USER_CAMPAIGNS = gql`
  query GetUserCampaigns {
    getUserCampaigns {
      _id
      name
    }
  }`;

// export const QUERY_NOTES = `

// `;

export const GET_CAMPAIGN_NOTES = gql`
  query GetCampaignNotes($campaignId: ID!) {
    getCampaignNotes(campaignId: $campaignId) {
      _id
      title
      text
      creator {
        username
      }
    }
  }`;