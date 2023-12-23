import { DoctorVM } from "./DoctorVM";
import { MkbVM } from "./MkbVM";
import { OperationVM } from "./OperationVM";

export interface PatientVM {
    id: string;
    identificationNumber: number;
    firstName: string;
    lastName: string;
    birthDate: string;
    sex: string;
    leadingMkb: MkbVM;
    patientMkbs: MkbVM[];
    operations?: OperationVM[];
    admissionDateTime: string;
    patientAddress: string;
    leadingDoctor: DoctorVM;
    patientAge: number;
}