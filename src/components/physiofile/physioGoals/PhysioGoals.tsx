import { type FC } from "react";
import { type GoalVM } from "../../../models/physiofile/goals/GoalVM";
import { type PatientGoalVM } from "../../../models/physiofile/goals/PatientGoalVM";

type PhysioGoalsProps = {
	goalsList: GoalVM[];
	patientGoals: PatientGoalVM[];
};

const PhysioGoals: FC<PhysioGoalsProps> = ({
	goalsList,
	patientGoals,
}: PhysioGoalsProps) => {
	return <div>PhysioGoals</div>;
};

export default PhysioGoals;
