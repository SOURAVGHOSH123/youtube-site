import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from './slice/userSlice.js'
// import reviewReducer from '../redux/slices/reviewSlice'
// import wishReducer from '../redux/slices/wishSlice'

// combine reducers
const rootReducer = combineReducers({
   auth: userReducer,
   // wish: wishReducer,
   // review: reviewReducer,
});

// persist config
const persistConfig = {
   key: "root",
   storage,
   whitelist: ["auth"],
};

// persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// store
const store = configureStore({
   reducer: persistedReducer,
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: false,
      }),
});

// persistor
export const persistor = persistStore(store);
export { store };
