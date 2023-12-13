import { BedVM } from "./BedVM";

export interface BoxVM {
    id: string;
    name: string;
    beds: BedVM[];
}