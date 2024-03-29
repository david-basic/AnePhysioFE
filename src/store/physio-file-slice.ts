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
import { type FunctionalDiagnosisVM } from "../models/physiofile/functionalDiagnosis/FunctionalDiagnosisVM";
import { UserVM } from "../models/UserVm";
import { Point } from "../models/physiofile/assessment/Point";

const fileInitState: PhysioFileVM[] = [
	{
		id: "",
		fileOpenedBy: {
			id: "",
			firstName: "",
			lastName: "",
			title: "",
			role: "",
			sex: "",
		},
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
		patientFunctionalDiagnoses: [],
		assessment: { id: "", patientRass: [], notes: "", pointsOfPain: [] },
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
		fileClosedBy: {
			id: "",
			firstName: "",
			lastName: "",
			title: "",
			role: "",
			sex: "",
		},
		fileClosedAt: "",
		allPhysiotherapists: [],
		departmentId: "",
	},
];

const physioFileInitState: PhysioFileInitStateType = {
	currentPhysioFile: fileInitState[0],
	currentPatientPhysioFileList: fileInitState,
	functionalDiagnosisList: [],
	currentPatientId: "",
	physioFileDataSaved: true,
	rassModalDataSaved: true,
	gcsModalDataSaved: true,
	vasModalDataSaved: true,
	mmtModalDataSaved: true,
	cpaxModalDataSaved: true,
	fdModalDataSaved: true,
	procedureModalDataSaved: true,
};

const physioFileSlice = createSlice({
	name: "physio-file",
	initialState: physioFileInitState,
	reducers: {
		setCurrentPhysioFile: (state, action: PayloadAction<PhysioFileVM>) => {
			state.currentPhysioFile = action.payload;
		},
		setCurrentPatientPhysioFileList: (
			state,
			action: PayloadAction<PhysioFileVM[]>
		) => {
			state.currentPatientPhysioFileList = action.payload;
		},
		setCurrentPatientId: (state, action: PayloadAction<string>) => {
			state.currentPatientId = action.payload;
		},
		setPhysioFileDataSaved: (state, action: PayloadAction<boolean>) => {
			state.physioFileDataSaved = action.payload;
		},
		setRassModalDataSaved: (state, action: PayloadAction<boolean>) => {
			state.rassModalDataSaved = action.payload;
		},
		setGcsModalDataSaved: (state, action: PayloadAction<boolean>) => {
			state.gcsModalDataSaved = action.payload;
		},
		setVasModalDataSaved: (state, action: PayloadAction<boolean>) => {
			state.vasModalDataSaved = action.payload;
		},
		setMmtModalDataSaved: (state, action: PayloadAction<boolean>) => {
			state.mmtModalDataSaved = action.payload;
		},
		setCpaxModalDataSaved: (state, action: PayloadAction<boolean>) => {
			state.cpaxModalDataSaved = action.payload;
		},
		setFuncDiagModalDataSaved: (state, action: PayloadAction<boolean>) => {
			state.fdModalDataSaved = action.payload;
		},
		setProcedureModalDataSaved: (state, action: PayloadAction<boolean>) => {
			state.procedureModalDataSaved = action.payload;
		},
		setFunctionalDiagnosisList: (
			state,
			action: PayloadAction<FunctionalDiagnosisVM[]>
		) => {
			state.functionalDiagnosisList = action.payload;
		},
		setPatient: (state, action: PayloadAction<PatientVM>) => {
			state.currentPhysioFile.patient = action.payload;
		},
		setPatientFunctionalDiagnoses: (
			state,
			action: PayloadAction<PatientFunctionalDiagnosisVM[]>
		) => {
			state.currentPhysioFile.patientFunctionalDiagnoses = action.payload;
		},
		setAssessment: (state, action: PayloadAction<AssessmentVM>) => {
			state.currentPhysioFile.assessment = action.payload;
		},
		setAssessmentNotes: (state, action: PayloadAction<string>) => {
			state.currentPhysioFile.assessment.notes = action.payload;
		},
		setAssessmentPainPoints: (state, action: PayloadAction<Point[]>) => {
			state.currentPhysioFile.assessment.pointsOfPain = action.payload;
		},
		setPatientRass: (state, action: PayloadAction<PatientRassVM[]>) => {
			state.currentPhysioFile.assessment.patientRass = action.payload;
		},
		setPatientGoals: (state, action: PayloadAction<PatientGoalVM[]>) => {
			state.currentPhysioFile.patientGoals = action.payload;
		},
		setIntubatedPatientGoalDescription: (
			state,
			action: PayloadAction<string>
		) => {
			state.currentPhysioFile.patientGoals[0].description =
				action.payload;
		},
		setExtubatedPatientGoalDescription: (
			state,
			action: PayloadAction<string>
		) => {
			state.currentPhysioFile.patientGoals[1].description =
				action.payload;
		},
		setPatientPlans: (state, action: PayloadAction<PatientPlanVM[]>) => {
			state.currentPhysioFile.patientPlans = action.payload;
		},
		setIntubatedPatientPlanDescription: (
			state,
			action: PayloadAction<string>
		) => {
			state.currentPhysioFile.patientPlans[0].description =
				action.payload;
		},
		setExtubatedPatientPlanDescription: (
			state,
			action: PayloadAction<string>
		) => {
			state.currentPhysioFile.patientPlans[1].description =
				action.payload;
		},
		setNotes: (state, action: PayloadAction<string>) => {
			state.currentPhysioFile.notes = action.payload;
		},
		setPhysioTest: (state, action: PayloadAction<PhysioTestVM>) => {
			state.currentPhysioFile.physioTest = action.payload;
		},
		setConclussion: (state, action: PayloadAction<string>) => {
			state.currentPhysioFile.conclussion = action.payload;
		},
		setFileClosedBy: (state, action: PayloadAction<UserVM>) => {
			state.currentPhysioFile.fileClosedBy = action.payload;
		},
		resetPhysioFileToInitValues: (state) => {
			state.currentPhysioFile = fileInitState[0];
			state.currentPatientPhysioFileList = fileInitState;
			state.currentPatientId = "";
			state.physioFileDataSaved = true;
			state.rassModalDataSaved = true;
			state.gcsModalDataSaved = true;
			state.vasModalDataSaved = true;
			state.mmtModalDataSaved = true;
			state.cpaxModalDataSaved = true;
			state.fdModalDataSaved = true;
			state.procedureModalDataSaved = true;
		},
	},
});

export const physioFileActions = physioFileSlice.actions;

export default physioFileSlice.reducer;
