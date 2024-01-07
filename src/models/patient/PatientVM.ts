import { type DoctorVM } from "../department/DoctorVM";
import { type OperationVM } from "./OperationVM";
import { type PatientAddressVM } from "./PatientAddressVM";
import { PatientMkbVM } from "./PatientMkbVM";
import { SexVM } from "./SexVM";

export interface PatientVM {
    id: string;
    identificationNumber: number;
    firstName: string;
    lastName: string;
    birthDate: string;
    sex: SexVM;
    leadingMkb: PatientMkbVM;
    patientMkbs: PatientMkbVM[];
    operations?: OperationVM[];
    admissionDateTime: string;
    patientAddress: PatientAddressVM;
    leadingDoctor: DoctorVM;
    patientAge: number;
}