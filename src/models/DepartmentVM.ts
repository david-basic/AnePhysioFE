import { BoxVM } from "./BoxVM";
import { LocalityVM } from "./LocalityVM";

export interface DepartmentVM {
    id: string;
    name: string;
    shorthand: string;
    boxes: BoxVM[];
    locality: LocalityVM;
}