import { type PatientRassVM } from "./PatientRassVM";

export interface AssessmentVM {
	id: string;
	patientRass: PatientRassVM[];
	notes: string;
}
