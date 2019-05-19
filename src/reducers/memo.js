import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {};

export default function memo(state=initialState, action) {
    switch (action.type) {
        case types.MEMO_WRITE_BTN_TOGGLE:
            return update(state, {
                isWriting: { $set: !state.isWriting }
            });
        default:
            return state;
    }
}