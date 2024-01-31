import { PatientVM } from "../patient/PatientVM";

export interface BedVM {
    id: string;
    patient?: PatientVM;
}