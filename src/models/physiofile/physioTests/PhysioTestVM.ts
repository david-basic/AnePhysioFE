import { type CpaxVM } from "./cpax/CpaxVM";
import { type GcsVM } from "./gcs/GcsVM";
import { type PatientMmtVM } from "./mmt/PatientMmt";
import { type VasVM } from "./VasVM";

export interface PhysioTestVM {
	id: string;
	cpax: CpaxVM[];
	gcs: GcsVM[];
	mmt: PatientMmtVM[];
	vas: VasVM[];
}
