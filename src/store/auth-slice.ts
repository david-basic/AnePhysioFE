import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const authInitState: AuthInitState = {
    isLoggedIn: false,
    username: "",
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
        resetAllStateToDefaults: (state) => {
            state = authInitState;
        }
    },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
