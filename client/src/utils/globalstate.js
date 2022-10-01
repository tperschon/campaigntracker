import React, { createContext, useContext } from "react";
import { useNoteReducer } from "./reducers";

const CampaignContext = createContext();
const { Provider } = CampaignContext;

const CampaignProvider = ({ value = [], ...props }) => {
  const [state, dispatch] = useNoteReducer({
    notes: []
  });

  return <Provider value={[state, dispatch]} {...props} />;
};

const useCampaignContext = () => {
  return useContext(CampaignContext);
};

export { CampaignProvider, useCampaignContext };