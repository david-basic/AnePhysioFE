export interface CreatePatientMmtRequestDto {
    physioTestId: string;
    grade: number;
    description: string;
    mmtDateTime: string;
    note: string;
}