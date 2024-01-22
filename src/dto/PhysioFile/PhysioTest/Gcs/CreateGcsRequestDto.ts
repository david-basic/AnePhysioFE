import { EyeOpeningResponseVM } from "../../../../models/physiofile/physioTests/gcs/EyeOpeningResponseVM";
import { MotorResponseVM } from "../../../../models/physiofile/physioTests/gcs/MotorResponseVM";
import { VerbalResponseVM } from "../../../../models/physiofile/physioTests/gcs/VerbalResponseVM";

export interface CreateGcsRequestDto {
    physioTestId: string;
    eyeOpeningResponse: EyeOpeningResponseVM;
    verbalResponse: VerbalResponseVM;
    motorResponse: MotorResponseVM;
    gcsDateTime: string;
}