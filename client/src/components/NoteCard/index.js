import React from "react";
import { REMOVE_NOTE } from '../../utils/mutations';
import { useMutation } from '@apollo/client';

function NoteCard(props) {
    const [removeNote, { error: removeNoteError }]= useMutation(REMOVE_NOTE);
    const deleteNote = async (event) => {
        console.log(event.target)
        console.log(event.target.id)
        await removeNote({
            variables: { removeNoteId: event.target.id }
        });
        window.location.reload();
    }
    return (
        <div>
            <h3>{props.title}</h3>
            <p>{props.text}</p>
            <input
                type="button"
                value="Delete"
                id={`${props._id}`}
                onClick={deleteNote}
            />
        </div>
    );
};

export default NoteCard;