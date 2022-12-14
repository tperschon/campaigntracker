import { gql } from '@apollo/client';

// For Signup
export const ADD_USER = gql`

  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
      }
    }
  }`;

// Add a Campaign
export const ADD_CAMPAIGN = gql`
  mutation addCampaign($name: String!) {
    addCampaign(name: $name) {
      _id
      name
      admins {
        _id
      }
      jCode
      players {
        _id
      }
    }
  }`;

// Join a Campaign
export const JOIN_CAMPAIGN = gql`
mutation JoinCampaign($jCode: String!) {
  joinCampaign(jCode: $jCode) {
    user {
      _id
      username
      email
    }
    campaign {
      _id
      name
    }
  }
}`;

// For Login
export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
      }
    }
  }`;

// Add a Note
export const ADD_NOTE = gql`
  mutation addNote($title: String!, $text: String!, $campaignId: ID!) {
    addNote(title: $title, text: $text, campaignId: $campaignId) {
      _id
      title
      text
      creator {
        _id
      }
      campaign {
        _id
      }
    }
  }`;

export const REMOVE_NOTE = gql`
  mutation removeNote($removeNoteId: ID!) {
    removeNote(id: $removeNoteId) {
      _id
    }
  }`;
