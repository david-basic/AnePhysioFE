import { type PatientRassVM } from "./PatientRassVM";
import { type Point } from "./Point";

export interface AssessmentVM {
	id: string;
	patientRass: PatientRassVM[];
	notes: string;
	pointsOfPain: Point[];
}
