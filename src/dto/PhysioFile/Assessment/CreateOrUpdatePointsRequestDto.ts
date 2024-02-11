import { type Point } from "../../../models/physiofile/assessment/Point";

export interface CreateOrUpdatePointsRequestDto {
    physioFileId: string;
	pointsOfPain: Point[];
}
