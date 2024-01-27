import { type FC } from "react";
import { type PlanVM } from "../../../models/physiofile/plans/PlanVM";
import { type PatientPlanVM } from "../../../models/physiofile/plans/PatientPlanVM";

type PhysioPlansProps = {
	plansList: PlanVM[];
	patientPlans: PatientPlanVM[];
};

const PhysioPlans: FC<PhysioPlansProps> = ({
	plansList,
	patientPlans,
}: PhysioPlansProps) => {
	return <div>PhysioPlans</div>;
};

export default PhysioPlans;
