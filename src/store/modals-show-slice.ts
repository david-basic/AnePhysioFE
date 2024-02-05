import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ModalsInitState = {
	showLeaveModal: boolean;
	showSaveModal: boolean;
	showRassModal: boolean;
	showGcsModal: boolean;
	showVasModal: boolean;
	showMmtModal: boolean;
	showCpaxModal: boolean;
	showFdModal: boolean;
	showProcedureModal: boolean;
	showCloseFileModal: boolean;
};

const modalsShowInitState: ModalsInitState = {
	showLeaveModal: false,
	showSaveModal: false,
	showRassModal: false,
	showGcsModal: false,
	showVasModal: false,
	showMmtModal: false,
	showCpaxModal: false,
	showFdModal: false,
	showProcedureModal: false,
	showCloseFileModal: false,
};

const modalsShowSlice = createSlice({
	name: "modalsShow",
	initialState: modalsShowInitState,
	reducers: {
		setShowLeaveModal: (state, action: PayloadAction<boolean>) => {
			state.showLeaveModal = action.payload;
		},
		setShowSaveModal: (state, action: PayloadAction<boolean>) => {
			state.showSaveModal = action.payload;
		},
		setShowCloseFileModal: (state, action: PayloadAction<boolean>) => {
			state.showCloseFileModal = action.payload;
		},
		setShowRassModal: (state, action: PayloadAction<boolean>) => {
			state.showRassModal = action.payload;
		},
		setShowGcsModal: (state, action: PayloadAction<boolean>) => {
			state.showGcsModal = action.payload;
		},
		setShowVasModal: (state, action: PayloadAction<boolean>) => {
			state.showVasModal = action.payload;
		},
		setShowMmtModal: (state, action: PayloadAction<boolean>) => {
			state.showMmtModal = action.payload;
		},
		setShowCpaxModal: (state, action: PayloadAction<boolean>) => {
			state.showCpaxModal = action.payload;
		},
		setShowFdModal: (state, action: PayloadAction<boolean>) => {
			state.showFdModal = action.payload;
		},
		setShowProcedureModal: (state, action: PayloadAction<boolean>) => {
			state.showProcedureModal = action.payload;
		},
		resetAllStateToDefaults: (state) => {
			state.showLeaveModal = modalsShowInitState.showLeaveModal;
			state.showSaveModal = modalsShowInitState.showSaveModal;
			state.showRassModal = modalsShowInitState.showRassModal;
			state.showGcsModal = modalsShowInitState.showGcsModal;
			state.showVasModal = modalsShowInitState.showVasModal;
			state.showMmtModal = modalsShowInitState.showMmtModal;
			state.showCpaxModal = modalsShowInitState.showCpaxModal;
			state.showFdModal = modalsShowInitState.showFdModal;
			state.showProcedureModal = modalsShowInitState.showProcedureModal;
			state.showCloseFileModal = modalsShowInitState.showCloseFileModal;
		},
	},
});

export const modalsShowActions = modalsShowSlice.actions;

export default modalsShowSlice.reducer;
