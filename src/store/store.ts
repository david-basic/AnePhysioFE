import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import deptReducer from "./dept-slice";
import deptLocalitiesReducer from "./dept-localities-slice"

const store = configureStore({
	reducer: {
		auth: authReducer,
		dept: deptReducer,
		deptLocalities: deptLocalitiesReducer,
	},
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
