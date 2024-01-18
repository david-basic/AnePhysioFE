import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import { type PhysioFileVM } from "../models/physiofile/PhysioFileVM";
import { type PhysioFileInitStateType } from "../type";
import { type PatientVM } from "../models/patient/PatientVM";
import { type PatientGoalVM } from "../models/physiofile/goals/PatientGoalVM";
import { type PatientPlanVM } from "../models/physiofile/plans/PatientPlanVM";
import { type PhysioTestVM } from "../models/physiofile/physioTests/PhysioTestVM";
import { type PatientFunctionalDiagnosisVM } from "../models/physiofile/functionalDiagnosis/PatientFunctionalDiagnosisVM";
import { type AssessmentVM } from "../models/physiofile/assessment/AssessmentVM";
import { type PatientRassVM } from "../models/physiofile/assessment/PatientRassVM";

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
		setPhysioFile: (state, action: PayloadAction<PhysioFileVM>) => {
			state.physioFile = action.payload;
		},
		setDataSaved: (state, action: PayloadAction<boolean>) => {
			state.dataSaved = action.payload;
		},
		setPatient: (state, action: PayloadAction<PatientVM>) => {
			state.physioFile.patient = action.payload;
		},
		setPatientFunctionalDiagnoses: (
			state,
			action: PayloadAction<PatientFunctionalDiagnosisVM[]>
		) => {
			state.physioFile.patientFunctionalDiagnoses = action.payload;
		},
		setAssessment: (state, action: PayloadAction<AssessmentVM>) => {
			state.physioFile.assessment = action.payload;
		},
		setAssessmentNotes: (state, action: PayloadAction<string>) => {
			state.physioFile.assessment.notes = action.payload;
		},
		setPatientRass: (state, action: PayloadAction<PatientRassVM[]>) => {
			state.physioFile.assessment.patientRass = action.payload;
		},
		setPatientGoals: (state, action: PayloadAction<PatientGoalVM[]>) => {
			state.physioFile.patientGoals = action.payload;
		},
		setPatientPlans: (state, action: PayloadAction<PatientPlanVM[]>) => {
			state.physioFile.patientPlans = action.payload;
		},
		setNotes: (state, action: PayloadAction<string>) => {
			state.physioFile.notes = action.payload;
		},
		setPhysioTest: (state, action: PayloadAction<PhysioTestVM>) => {
			state.physioFile.physioTest = action.payload;
		},
		setConclussion: (state, action: PayloadAction<string>) => {
			state.physioFile.conclussion = action.payload;
		},
		setFileClosedBy: (state, action: PayloadAction<string>) => {
			state.physioFile.fileClosedBy = action.payload;
		},
		resetPhysioFileToInitValues: (state) => {
			state.physioFile = fileInitState;
			state.dataSaved = true;
		},
	},
});

export const physioFileActions = physioFileSlice.actions;

export default physioFileSlice.reducer;
