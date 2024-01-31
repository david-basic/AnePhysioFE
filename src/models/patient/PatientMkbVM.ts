import { MkbVM } from "./MkbVM";

export interface PatientMkbVM {
    id: string;
    mkbCode: MkbVM;
    patientId: string;
    displayName: string;
}