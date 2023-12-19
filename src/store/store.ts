import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import deptReducer from "./dept-slice";

const store = configureStore({
	reducer: {
		auth: authReducer,
		dept: deptReducer,
	},
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
