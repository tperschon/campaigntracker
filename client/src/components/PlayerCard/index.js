import React from "react";

function PlayerCard(props) {
    const isStart = props.key === 0 ? true : false;
    return (
        <div>
            <span>{isStart ? (" - ") : ("  ")}{props.username}</span>
        </div>
    );
};

export default PlayerCard;