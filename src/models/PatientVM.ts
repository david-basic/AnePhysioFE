import { type DoctorVM } from "./DoctorVM";
import { type MkbVM } from "./MkbVM";
import { type OperationVM } from "./OperationVM";
import { type PatientAddressVM } from "./PatientAddressVM";

export interface PatientVM {
    id: string;
    identificationNumber: number;
    firstName: string;
    lastName: string;
    birthDate: Date;
    sex: string;
    leadingMkb: MkbVM;
    patientMkbs: MkbVM[];
    operations?: OperationVM[];
    admissionDateTime: Date;
    patientAddress: PatientAddressVM;
    leadingDoctor: DoctorVM;
    patientAge: number;
}