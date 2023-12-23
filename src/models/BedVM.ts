import { PatientVM } from "./PatientVM";

export interface BedVM {
    id: string;
    patient?: PatientVM;
}