import { type DoctorVM } from "../department/DoctorVM";
import { type MkbVM } from "./MkbVM";
import { type OperationVM } from "./OperationVM";
import { type PatientAddressVM } from "./PatientAddressVM";
import { SexVM } from "./SexVM";

export interface PatientVM {
    id: string;
    identificationNumber: number;
    firstName: string;
    lastName: string;
    birthDate: string;
    sex: SexVM;
    leadingMkb: MkbVM;
    patientMkbs: MkbVM[];
    operations?: OperationVM[];
    admissionDateTime: string;
    patientAddress: PatientAddressVM;
    leadingDoctor: DoctorVM;
    patientAge: number;
}