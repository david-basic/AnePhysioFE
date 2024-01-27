import { type DefinitionAopVM } from "../../../../models/physiofile/physioTests/cpax/DefinitionAopVM";

export interface CreateCpaxRequestDto {
	physioTestId: string;
	respiratoryAop: DefinitionAopVM;
	coughAop: DefinitionAopVM;
	dynamicSittingAop: DefinitionAopVM;
	gripStrengthAop: DefinitionAopVM;
	movingWithinBedAop: DefinitionAopVM;
	sitToStandAop: DefinitionAopVM;
	standingBalanceAop: DefinitionAopVM;
	steppingAop: DefinitionAopVM;
	transferringFromBedAop: DefinitionAopVM;
	supineToSittingAop: DefinitionAopVM;
	cpaxDateTime: string;
}
