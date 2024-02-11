import { type PatientFunctionalDiagnosisVM } from "../../models/physiofile/functionalDiagnosis/PatientFunctionalDiagnosisVM";
import { PatientGoalVM } from "../../models/physiofile/goals/PatientGoalVM";
import { PatientPlanVM } from "../../models/physiofile/plans/PatientPlanVM";

export interface UpdatePhysioFileRequestDto {
    patientFunctionalDiagnoses: PatientFunctionalDiagnosisVM[];
    assessmentNotes: string;
    patientGoals: PatientGoalVM[];
    patientPlans: PatientPlanVM[];
    notes: string;
    conclussion: string;
}