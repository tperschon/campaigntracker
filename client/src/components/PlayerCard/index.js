import React from "react";

function PlayerCard(props) {
    const isStart = props.index === 0 ? true : false;
    return (
        <div>
            <span>{!isStart ? (" - ") : ("  ")}{props.username}</span>
        </div>
    );
};

export default PlayerCard;