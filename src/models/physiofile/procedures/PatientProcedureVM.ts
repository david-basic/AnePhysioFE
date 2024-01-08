import { ProcedureVM } from "./ProcedureVM";

export interface PatientProcedureVM extends ProcedureVM {
	date: string;
	workingTherapists: string;
}
