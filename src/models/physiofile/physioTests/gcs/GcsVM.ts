import { GcsResponseVM } from "./GcsResponseVM";

export interface GcsVM {
	eyeOpeningResponse: GcsResponseVM;
	verbalResponse: GcsResponseVM;
	motorResponse: GcsResponseVM;
	gcsDateTime: string;
}
