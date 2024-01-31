import { type UserVM } from "../../UserVm";
import { type ProcedureVM } from "./ProcedureVM";

export interface PatientProcedureVM extends ProcedureVM {
	dateTime: string;
	workingTherapists: UserVM[];
}
