export interface CreatePatientProcedureRequestDto {
    physioFileId: string;
    description: string;
    dateTime: string;
    workingTherapistsIds: string[];
}
