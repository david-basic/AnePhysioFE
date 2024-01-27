import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import { type AuthInitState } from "../type";

const authInitState: AuthInitState = {
	isLoggedIn: false,
	username: "",
	accessToken: "",
	refreshToken: "",
	tokenType: "Bearer",
	tokenIsValid: false,
};

const authSlice = createSlice({
	name: "auth",
	initialState: authInitState,
	reducers: {
		setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
			state.isLoggedIn = action.payload;
		},
		setUsername: (state, action: PayloadAction<string>) => {
			state.username = action.payload;
		},
		setAccessToken: (state, action: PayloadAction<string>) => {
			state.accessToken = action.payload;
		},
		setRefreshToken: (state, action: PayloadAction<string>) => {
			state.refreshToken = action.payload;
		},
		setTokenType: (state, action: PayloadAction<string>) => {
			state.tokenType = action.payload;
		},
		setTokenIsValid: (state, action: PayloadAction<boolean>) => {
			state.tokenIsValid = action.payload;
		},
		resetAllStateToDefaults: (state) => {
			state.isLoggedIn = authInitState.isLoggedIn;
			state.username = authInitState.username;
			state.accessToken = authInitState.accessToken;
			state.refreshToken = authInitState.refreshToken;
			state.tokenType = authInitState.tokenType;
			state.tokenIsValid = authInitState.tokenIsValid;
		},
	},
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
