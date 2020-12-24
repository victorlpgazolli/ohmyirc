import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

export default reducers => {
    const persistedReducer = persistReducer(
        {
            key: "ohmyirc",
            storage: storage,
            whitelist: ["irc"]
        },
        reducers
    );

    return persistedReducer;
};
