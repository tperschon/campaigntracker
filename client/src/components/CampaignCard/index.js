import React from "react";
import { Link } from "react-router-dom";
function CampaignCard(props) {
  const { campaign } = props;
  return (
  <div>
    <Link to={`/campaigns/${campaign._id}`}><h2>{campaign.name}</h2></Link>
  </div>
  );
}
export default CampaignCard;