import { gql } from '@apollo/client';

// IN PROGRESS
export const QUERY_USER = gql`
  {
    user {

    }
  }`

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