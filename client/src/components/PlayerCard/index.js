import React from "react";

function PlayerCard(props) {
    console.log(props.player)
    // if(props.player) console.log(props.player);
    const isStart = props.index === 0 ? true : false;
    return (
            <span className={props.player.type}>{!isStart ? (" - ") : ("  ")}{props.player.player.username}</span>
    );
};

export default PlayerCard;