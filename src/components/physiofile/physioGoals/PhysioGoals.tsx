import { ChangeEvent, FocusEvent, useEffect, useState, type FC } from "react";
import { type GoalVM } from "../../../models/physiofile/goals/GoalVM";
import { type PatientGoalVM } from "../../../models/physiofile/goals/PatientGoalVM";
import { PhysioFileVM } from "../../../models/physiofile/PhysioFileVM";
import { Checkbox, Col, Row } from "antd";
import fileStyles from "../PhysioFile.module.css";
import assessmentStyles from "../assessment/Assessment.module.css";
import { useAppDispatch } from "../../../hooks/use_app_dispatch";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { physioFileActions } from "../../../store/physio-file-slice";
import TextArea from "antd/es/input/TextArea";
import goalStyles from "./PhysioGoals.module.css";

type PhysioGoalsProps = {
	physioFile: PhysioFileVM;
	goalsList: GoalVM[];
	patientGoals: PatientGoalVM[];
};

const PhysioGoals: FC<PhysioGoalsProps> = ({
	physioFile,
	goalsList,
	patientGoals,
}: PhysioGoalsProps) => {
	const dispatch = useAppDispatch();
	const [allPatientGoals, setAllPatientGoals] = useState<PatientGoalVM[]>(
		patientGoals || []
	);
	const [intubatedPatientGoal, setIntubatedPatientGoal] =
		useState<PatientGoalVM>(patientGoals[0]);
	const [extubatedPatientGoal, setExtubatedPatientGoal] =
		useState<PatientGoalVM>(patientGoals[1]);
	const [
		intubatedPatientGoalDescription,
		setIntubatedPatientGoalDescription,
	] = useState<string>("");
	const [
		extubatedPatientGoalDescription,
		setExtubatedPatientGoalDescription,
	] = useState<string>("");
	const defaultSelectedValues: string[] = [];
	patientGoals.map((pg) => pg.selected && defaultSelectedValues.push(pg.id));

	useEffect(() => {
		if (patientGoals[0] && patientGoals[1]) {
			setIntubatedPatientGoalDescription(patientGoals[0].description);
			setExtubatedPatientGoalDescription(patientGoals[1].description);
		}
	}, [patientGoals]);

	const onCheckedChangeHandler = (checkedValues: CheckboxValueType[]) => {
		const newPatientGoalsState: PatientGoalVM[] = [];
		const checkedSet = new Set(checkedValues);
		allPatientGoals.forEach((pg) => {
			if (checkedSet.has(pg.id)) {
				const newPatientGoal: PatientGoalVM = {
					id: pg.id,
					selected: true,
					description:
						pg.type === "Intubirani"
							? intubatedPatientGoalDescription
							: extubatedPatientGoalDescription,
					type: pg.type,
				};
				newPatientGoalsState.push(newPatientGoal);

				pg.type === "Intubirani"
					? setIntubatedPatientGoal(newPatientGoal)
					: setExtubatedPatientGoal(newPatientGoal);
			} else {
				const newPatientGoal: PatientGoalVM = {
					id: pg.id,
					selected: false,
					description:
						pg.type === "Intubirani"
							? intubatedPatientGoalDescription
							: extubatedPatientGoalDescription,
					type: pg.type,
				};
				newPatientGoalsState.push(newPatientGoal);

				pg.type === "Intubirani"
					? setIntubatedPatientGoal(newPatientGoal)
					: setExtubatedPatientGoal(newPatientGoal);
			}
		});

		setAllPatientGoals(newPatientGoalsState);

		dispatch(physioFileActions.setPatientGoals(newPatientGoalsState));
		dispatch(physioFileActions.setPhysioFileDataSaved(false));
	};

	const handleChangeIntubatedDescription = (
		event: ChangeEvent<HTMLTextAreaElement>
	) => {
		setIntubatedPatientGoalDescription(event.target.value);
	};

	const handleChangeExtubatedDescription = (
		event: ChangeEvent<HTMLTextAreaElement>
	) => {
		setExtubatedPatientGoalDescription(event.target.value);
	};

	const handleLoseFocusIntubated = (
		event: FocusEvent<HTMLTextAreaElement>
	) => {
		dispatch(
			physioFileActions.setIntubatedPatientGoalDescription(
				event.target.value
			)
		);
		dispatch(physioFileActions.setPhysioFileDataSaved(false));
	};

	const handleLoseFocusExtubated = (
		event: FocusEvent<HTMLTextAreaElement>
	) => {
		dispatch(
			physioFileActions.setExtubatedPatientGoalDescription(
				event.target.value
			)
		);
		dispatch(physioFileActions.setPhysioFileDataSaved(false));
	};

	return (
		<Checkbox.Group
			onChange={onCheckedChangeHandler}
			className={goalStyles.checkboxGroup}
			defaultValue={defaultSelectedValues}>
			<Col className={goalStyles.col}>
				{intubatedPatientGoal && (
					<Row
						align='middle'
						className={goalStyles.row}
						style={{ marginBottom: "8px" }}>
						<Checkbox
							className={`${fileStyles.texts} ${goalStyles.checkbox}`}
							disabled={physioFile.fileClosedBy !== null}
							style={{ fontWeight: 400 }}
							value={intubatedPatientGoal.id}>
							{intubatedPatientGoal.type}
						</Checkbox>
						{allPatientGoals[0].selected && (
							<TextArea
								value={intubatedPatientGoalDescription}
								disabled={physioFile.fileClosedBy !== null}
								autoSize={{ minRows: 1, maxRows: 2 }}
								onChange={handleChangeIntubatedDescription}
								onBlur={handleLoseFocusIntubated}
								placeholder={`${intubatedPatientGoal.type} ciljevi`}
								className={`${assessmentStyles.textArea}  ${goalStyles.textArea}`}
							/>
						)}
					</Row>
				)}
				{extubatedPatientGoal && (
					<Row align='middle' className={goalStyles.row}>
						<Checkbox
							className={`${fileStyles.texts} ${goalStyles.checkbox}`}
							disabled={physioFile.fileClosedBy !== null}
							style={{ fontWeight: 400 }}
							value={extubatedPatientGoal.id}>
							{extubatedPatientGoal.type}
						</Checkbox>
						{allPatientGoals[1].selected && (
							<TextArea
								value={extubatedPatientGoalDescription}
								disabled={physioFile.fileClosedBy !== null}
								autoSize={{ minRows: 1, maxRows: 2 }}
								onChange={handleChangeExtubatedDescription}
								onBlur={handleLoseFocusExtubated}
								placeholder={`${extubatedPatientGoal.type} ciljevi`}
								className={`${assessmentStyles.textArea}  ${goalStyles.textArea}`}
							/>
						)}
					</Row>
				)}
			</Col>
		</Checkbox.Group>
	);
};

export default PhysioGoals;
