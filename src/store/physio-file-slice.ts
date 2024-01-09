import { createSlice } from "@reduxjs/toolkit";
import { PhysioFileVM } from "../models/physiofile/PhysioFileVM";
import { PhysioFileInitStateType } from "../type";

const fileInitState: PhysioFileVM = {
	id: "",
	fileOpenedBy: "",
	patient: {
		id: "",
		identificationNumber: 0,
		firstName: "",
		lastName: "",
		birthDate: "",
		sex: { id: "", name: "", displayName: "" },
		leadingMkb: {
			id: "",
			mkbCode: { id: "", code: "", displayName: "" },
			patientId: "",
			displayName: "",
		},
		patientMkbs: [],
		operations: [],
		admissionDateTime: "",
		patientAddress: { id: "", fullAddress: "" },
		leadingDoctor: { id: "", role: "", fullNameAndTitles: "" },
		patientAge: 0,
	},
	fullFunctionalDiagnosisList: [],
	patientFunctionalDiagnoses: [],
	assessment: { id: "", patientRass: [], notes: "" },
	fullRassList: [],
	fullGoalsList: [],
	patientGoals: [],
	fullPlansList: [],
	patientPlans: [],
	notes: "",
	fullProcedureList: [],
	patientProcedures: [],
	physioTest: {
		id: "",
		cpax: [],
		gcs: [],
		mmt: [],
		vas: [],
	},
	allAspectsOfPhysicality: [],
	allEyeOpeningResponses: [],
	allMotorResponses: [],
	allVerbalResponses: [],
	mmtList: [],
	conclussion: "",
	fileClosedBy: "",
	allPhysiotherapists: [],
};

const physioFileInitState: PhysioFileInitStateType = {
	physioFile: fileInitState,
	dataSaved: true,
};

const physioFileSlice = createSlice({
    name: "physio-file",
    initialState: physioFileInitState,
    reducers: {
        resetPhysioFileToInitValues: (state) => {
            state.physioFile = fileInitState;
            state.dataSaved = true;
        },
    },
});

export const physioFileActions = physioFileSlice.actions;

export default physioFileSlice.reducer;
