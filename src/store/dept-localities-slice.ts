import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import { type DepartmentVM } from "../models/department/DepartmentVM";
import { type DepartmentLocalitiesInitState } from "../type";

const deptInitState: DepartmentVM = {
	id: "",
	name: "",
	shorthand: "",
	locality: { id: "", name: "", displayName: "" },
	boxes: [],
};

const deptLocalitiesInitState: DepartmentLocalitiesInitState = {
	jilRIjeka: deptInitState,
	jilSusak: deptInitState,
	crc: deptInitState,
	kardioJil: deptInitState,
};

const deptLocalitiesSlice = createSlice({
	name: "dept-localities",
	initialState: deptLocalitiesInitState,
	reducers: {
		setJilRijeka: (state, action: PayloadAction<DepartmentVM>) => {
			state.jilRIjeka = action.payload;
		},
		setJilSusak: (state, action: PayloadAction<DepartmentVM>) => {
			state.jilSusak = action.payload;
		},
		setCrc: (state, action: PayloadAction<DepartmentVM>) => {
			state.crc = action.payload;
		},
		setKardioJil: (state, action: PayloadAction<DepartmentVM>) => {
			state.kardioJil = action.payload;
		},
		resetDepartmentLocaltiesToInitValues: (state) => {
            state.jilRIjeka = deptInitState;
            state.jilSusak = deptInitState;
            state.crc = deptInitState;
            state.kardioJil = deptInitState
        },
	},
});

export const deptLocalitiesActions = deptLocalitiesSlice.actions;

export default deptLocalitiesSlice.reducer;
