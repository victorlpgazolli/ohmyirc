import { combineReducers } from "redux";
import { reducer as irc } from 'react-irc'

const allReducers = combineReducers({
    irc
});

const rootReducer = (state, action) => {
    if (action.type === 'RESET_STATE') {
        localStorage.clear()
        state = undefined;
    }

    return allReducers(state, action);
};

export default rootReducer;