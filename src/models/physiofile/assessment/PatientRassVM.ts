import { RassVM } from "./RassVM";

export interface PatientRassVM extends RassVM {
	additionalDescription: string;
	rassDateTime: string;
}
