import { GcsResponseVM } from "./GcsResponseVM";

export interface GcsVM {
	id: string;
	eyeOpeningResponse: GcsResponseVM;
	verbalResponse: GcsResponseVM;
	motorResponse: GcsResponseVM;
	gcsDateTime: string;
}
