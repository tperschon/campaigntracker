import { useReducer } from 'react';
import { ADD_NOTE, REMOVE_NOTE } from './actions';

export const reducer = (state, action) => {
    switch (action.type) {
        // returns a new state with the new note added to the notes array
        case ADD_NOTE:
            return {
                ...state,
                notes: [...state.notes, action.note]
            };
        // returns a new state with the note deleted from the notes array
        case REMOVE_NOTE:
            let newState = state.notes.filter((note) => {
                return note._id !== action._id;
              });
            return {
                ...state,
                notes: newState,
            };
        // if no action or mismatching action, return state as-is so we dn't crash
        default:
            return state;
    }
};

export function useNoteReducer(initialState) {
    return useReducer(reducer, initialState);
};
