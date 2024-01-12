import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import { type PhysioFileVM } from "../models/physiofile/PhysioFileVM";
import { PatientRassAdditionalNotesUpdateType, type PhysioFileInitStateType } from "../type";
import { type PatientVM } from "../models/patient/PatientVM";
import { type PatientGoalVM } from "../models/physiofile/goals/PatientGoalVM";
import { PatientPlanVM } from "../models/physiofile/plans/PatientPlanVM";
import { PhysioTestVM } from "../models/physiofile/physioTests/PhysioTestVM";
import { CpaxVM } from "../models/physiofile/physioTests/cpax/CpaxVM";
import { GcsVM } from "../models/physiofile/physioTests/gcs/GcsVM";
import { PatientMmtVM } from "../models/physiofile/physioTests/mmt/PatientMmt";
import { VasVM } from "../models/physiofile/physioTests/VasVM";
import { PatientFunctionalDiagnosisVM } from "../models/physiofile/functionalDiagnosis/PatientFunctionalDiagnosisVM";
import { AssessmentVM } from "../models/physiofile/assessment/AssessmentVM";
import { PatientRassVM } from "../models/physiofile/assessment/PatientRassVM";
import generateRandomNumber from "../util/generateRandomBigInteger";
import isNullOrEmpty from "../util/isNullOrEmpty";

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
		setPatientFunctionalDiagnoses: (state, action: PayloadAction<PatientFunctionalDiagnosisVM[]>) => {
			state.physioFile.patientFunctionalDiagnoses = action.payload;
		},
		setAssessment: (state, action: PayloadAction<AssessmentVM>) => {
			state.physioFile.assessment = action.payload;
		},
		setAssessmentNotes: (state, action: PayloadAction<string>) => {
			state.physioFile.assessment.notes = action.payload;
		},
		addAnotherPatientRassInstance: (state, action: PayloadAction<PatientRassVM>) => {
			const newPatientRass = action.payload;

			if (state.physioFile.assessment.patientRass.length === 0) {
				const randomNumberStr = generateRandomNumber(12);
				isNullOrEmpty(randomNumberStr) ? newPatientRass.id = "1" : newPatientRass.id = randomNumberStr!;
			} else {
				newPatientRass.id = (state.physioFile.assessment.patientRass.length + 1).toString();
			}

			state.physioFile.assessment.patientRass.push(newPatientRass);
		},
		updateAdditionalNotesForPatientRassWithId: (state, action: PayloadAction<PatientRassAdditionalNotesUpdateType>) => {
			state.physioFile.assessment.patientRass.forEach(pr => {
				if (pr.id === action.payload.idToUpdate) {
					pr.additionalDescription = action.payload.additionalDescription;
				}
			});
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
		addAnotherCpaxInstance: (state, action: PayloadAction<CpaxVM>) => {
			const newCpax = action.payload;

			if (state.physioFile.physioTest.cpax.length === 0) {
				const randomNumberStr = generateRandomNumber(12);
				isNullOrEmpty(randomNumberStr) ? newCpax.id = "1" : newCpax.id = randomNumberStr!;
			} else {
				newCpax.id =(state.physioFile.physioTest.cpax.length + 1).toString();
			}

			if (state.physioFile.physioTest === null) {
				state.physioFile.physioTest = {cpax: [], gcs: [], mmt: [], vas: []}
			}

			state.physioFile.physioTest.cpax.push(newCpax);
		},
		addAnotherGcsInstance: (state, action: PayloadAction<GcsVM>) => {
			const newGcs = action.payload;

			if (state.physioFile.physioTest.gcs.length === 0) {
				const randomNumberStr = generateRandomNumber(12);
				isNullOrEmpty(randomNumberStr) ? newGcs.id = "1" : newGcs.id = randomNumberStr!;
			} else {
				newGcs.id =(state.physioFile.physioTest.gcs.length + 1).toString();
			}

			if (state.physioFile.physioTest === null) {
				state.physioFile.physioTest = {cpax: [], gcs: [], mmt: [], vas: []}
			}

			state.physioFile.physioTest.gcs.push(newGcs);
		},
		addAnotherPatientMmtInstance: (state, action: PayloadAction<PatientMmtVM>) => {
			const newPatientMmt = action.payload;

			if (state.physioFile.physioTest.mmt.length === 0) {
				const randomNumberStr = generateRandomNumber(12);
				isNullOrEmpty(randomNumberStr) ? newPatientMmt.id = "1" : newPatientMmt.id = randomNumberStr!;
			} else {
				newPatientMmt.id =(state.physioFile.physioTest.mmt.length + 1).toString();
			}
			
			if (state.physioFile.physioTest === null) {
				state.physioFile.physioTest = {cpax: [], gcs: [], mmt: [], vas: []}
			}

			state.physioFile.physioTest.mmt.push(newPatientMmt);
		},
		addAnotherVasInstance: (state, action: PayloadAction<VasVM>) => {
			const newVas = action.payload;

			if (state.physioFile.physioTest.vas.length === 0) {
				const randomNumberStr = generateRandomNumber(12);
				isNullOrEmpty(randomNumberStr) ? newVas.id = "1" : newVas.id = randomNumberStr!;
			} else {
				newVas.id =(state.physioFile.physioTest.vas.length + 1).toString();
			}

			if (state.physioFile.physioTest === null) {
				state.physioFile.physioTest = {cpax: [], gcs: [], mmt: [], vas: []}
			}

			state.physioFile.physioTest.vas.push(newVas);
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
