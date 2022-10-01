import React from "react";

function CampaignCard(props, key) {
  const { campaign } = props;
  return (
  <div>
    <h2>{campaign._id}</h2>
  </div>
  );
}

export default CampaignCard;
