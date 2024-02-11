import { type PatientVM } from "../patient/PatientVM";
import { type AssessmentVM } from "./assessment/AssessmentVM";
import { type GoalVM } from "./goals/GoalVM";
import { type PatientFunctionalDiagnosisVM } from "./functionalDiagnosis/PatientFunctionalDiagnosisVM";
import { type PatientGoalVM } from "./goals/PatientGoalVM";
import { type PatientPlanVM } from "./plans/PatientPlanVM";
import { type PatientProcedureVM } from "./procedures/PatientProcedureVM";
import { type PhysioTestVM } from "./physioTests/PhysioTestVM";
import { type PlanVM } from "./plans/PlanVM";
import { type ProcedureVM } from "./procedures/ProcedureVM";
import { type UserVM } from "../UserVm";
import { type RassVM } from "./assessment/RassVM";
import { type MmtVM } from "./physioTests/mmt/MmtVm";
import { type EyeOpeningResponseVM } from "./physioTests/gcs/EyeOpeningResponseVM";
import { type AopVM } from "./physioTests/cpax/AopVM";
import { type MotorResponseVM } from "./physioTests/gcs/MotorResponseVM";
import { type VerbalResponseVM } from "./physioTests/gcs/VerbalResponseVM";

export interface PhysioFileVM {
	id: string;
	fileOpenedBy: UserVM;
	patient: PatientVM;
	patientFunctionalDiagnoses: PatientFunctionalDiagnosisVM[];
	assessment: AssessmentVM;
	fullRassList: RassVM[];
	fullGoalsList: GoalVM[];
	patientGoals: PatientGoalVM[];
	fullPlansList: PlanVM[];
	patientPlans: PatientPlanVM[];
	notes: string;
	fullProcedureList: ProcedureVM[];
	patientProcedures: PatientProcedureVM[];
	physioTest: PhysioTestVM;
	allAspectsOfPhysicality: AopVM[];
	allEyeOpeningResponses: EyeOpeningResponseVM[];
	allMotorResponses: MotorResponseVM[];
	allVerbalResponses: VerbalResponseVM[];
	mmtList: MmtVM[];
	conclussion: string;
	fileClosedBy: UserVM;
	fileClosedAt: string;
	allPhysiotherapists: UserVM[];
	departmentId: string;
}
