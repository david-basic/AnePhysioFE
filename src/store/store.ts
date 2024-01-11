import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import deptLocalitiesReducer from "./dept-localities-slice";
import physioFileReducer from "./physio-file-slice";
import modalsShowReducer from "./modals-show-slice";
import {
	FLUSH,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
	REHYDRATE,
	persistReducer,
	persistStore,
} from "redux-persist";
import sessionStorage from "redux-persist/es/storage/session";

const rootReducer = combineReducers({
	authReducer,
	deptLocalitiesReducer,
	physioFileReducer,
	modalsShowReducer,
});

const persistConfig = {
	key: "root",
	version: 1,
	storage: sessionStorage,
	whitelist: ["authReducer", "deptLocalitiesReducer", "physioFileReducer"],
	blacklist: ["modalsShowReducer"],
};

const persistedRootReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
	reducer: persistedRootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [
					FLUSH,
					REHYDRATE,
					PAUSE,
					PERSIST,
					PURGE,
					REGISTER,
				],
			},
		}),
});

const persistor = persistStore(store);

export { store, persistor };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
