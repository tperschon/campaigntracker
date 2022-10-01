import React from "react";

function NoteCard(props) {
    return (
        <div>
            <h3>{props.title}</h3>
            <p>{props.text}</p>
            <input
                type="button"
                value="Delete"
            />
        </div>
    );
};

export default NoteCard;