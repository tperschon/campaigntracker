import React from "react";

function NoteCard(props) {
    return (
        <div>
            <h3>{props.title}</h3>
            <p>{props.text}</p>
        </div>
    );
};

export default NoteCard;