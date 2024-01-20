import { FunctionalDiagnosisVM } from "./FunctionalDiagnosisVM";

export interface PatientFunctionalDiagnosisVM {
	id: string;
	selected: boolean;
	functionalDiagnosis: FunctionalDiagnosisVM;
	
}
