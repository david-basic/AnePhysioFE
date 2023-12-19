import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DepartmentVM } from "../models/DepartmentVM";
import { BoxVM } from "../models/BoxVM";

const deptInitState: DepartmentVM[] = [];

const deptSlice = createSlice({
	name: "dept",
	initialState: deptInitState,
	reducers: {
		addToDepartmentList: (state, action: PayloadAction<DepartmentVM>) => {
			const tempBoxes: BoxVM[] = [];
			action.payload.boxes.map((box) => tempBoxes.push(box));

			const dept: DepartmentVM = {
				id: action.payload.id,
				name: action.payload.name,
				shorthand: action.payload.shorthand,
				boxes: tempBoxes,
				locality: action.payload.locality,
			};

			state.push(dept);
		},
	},
});

export const deptActions = deptSlice.actions;

export default deptSlice.reducer;
