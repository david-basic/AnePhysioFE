import { ChangeEvent, FocusEvent, useEffect, useState, type FC } from "react";
import { type PlanVM } from "../../../models/physiofile/plans/PlanVM";
import { type PatientPlanVM } from "../../../models/physiofile/plans/PatientPlanVM";
import { PhysioFileVM } from "../../../models/physiofile/PhysioFileVM";
import { useAppDispatch } from "../../../hooks/use_app_dispatch";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { physioFileActions } from "../../../store/physio-file-slice";
import { Checkbox, Col, Row } from "antd";
import planStyles from "./PhysioPlans.module.css";
import fileStyles from "../PhysioFile.module.css";
import assessmentStyles from "../assessment/Assessment.module.css";
import TextArea from "antd/es/input/TextArea";

type PhysioPlansProps = {
	physioFile: PhysioFileVM;
	plansList: PlanVM[];
	patientPlans: PatientPlanVM[];
};

const PhysioPlans: FC<PhysioPlansProps> = ({
	physioFile,
	plansList,
	patientPlans,
}: PhysioPlansProps) => {
	const dispatch = useAppDispatch();
	const [allPatientPlans, setAllPatientPlans] = useState<PatientPlanVM[]>(
		patientPlans || []
	);
	const [intubatedPatientPlan, setIntubatedPatientPlan] =
		useState<PatientPlanVM>(patientPlans[0]);
	const [extubatedPatientPlan, setExtubatedPatientPlan] =
		useState<PatientPlanVM>(patientPlans[1]);
	const [
		intubatedPatientPlanDescription,
		setIntubatedPatientPlanDescription,
	] = useState<string>("");
	const [
		extubatedPatientPlanDescription,
		setExtubatedPatientPlanDescription,
	] = useState<string>("");
	const defaultSelectedValues: string[] = [];
	patientPlans.map((pp) => pp.selected && defaultSelectedValues.push(pp.id));

	useEffect(() => {
		if (patientPlans[0] && patientPlans[1]) {
			setIntubatedPatientPlanDescription(patientPlans[0].description);
			setExtubatedPatientPlanDescription(patientPlans[1].description);
		}
	}, [patientPlans]);

	const onCheckedChangeHandler = (checkedValues: CheckboxValueType[]) => {
		const newPatientPlansState: PatientPlanVM[] = [];
		const checkedSet = new Set(checkedValues);
		allPatientPlans.forEach((pp) => {
			if (checkedSet.has(pp.id)) {
				const newPatientPlan: PatientPlanVM = {
					id: pp.id,
					selected: true,
					description:
						pp.type === "Intubirani"
							? intubatedPatientPlanDescription
							: extubatedPatientPlanDescription,
					type: pp.type,
				};
				newPatientPlansState.push(newPatientPlan);

				pp.type === "Intubirani"
					? setIntubatedPatientPlan(newPatientPlan)
					: setExtubatedPatientPlan(newPatientPlan);
			} else {
				const newPatientPlan: PatientPlanVM = {
					id: pp.id,
					selected: false,
					description:
						pp.type === "Intubirani"
							? intubatedPatientPlanDescription
							: extubatedPatientPlanDescription,
					type: pp.type,
				};
				newPatientPlansState.push(newPatientPlan);

				pp.type === "Intubirani"
					? setIntubatedPatientPlan(newPatientPlan)
					: setExtubatedPatientPlan(newPatientPlan);
			}
		});

		setAllPatientPlans(newPatientPlansState);

		dispatch(physioFileActions.setPatientPlans(newPatientPlansState));
		dispatch(physioFileActions.setPhysioFileDataSaved(false));
	};

	const handleChangeIntubatedDescription = (
		event: ChangeEvent<HTMLTextAreaElement>
	) => {
		setIntubatedPatientPlanDescription(event.target.value);
	};

	const handleChangeExtubatedDescription = (
		event: ChangeEvent<HTMLTextAreaElement>
	) => {
		setExtubatedPatientPlanDescription(event.target.value);
	};

	const handleLoseFocusIntubated = (
		event: FocusEvent<HTMLTextAreaElement>
	) => {
		dispatch(
			physioFileActions.setIntubatedPatientPlanDescription(
				event.target.value
			)
		);
		dispatch(physioFileActions.setPhysioFileDataSaved(false));
	};

	const handleLoseFocusExtubated = (
		event: FocusEvent<HTMLTextAreaElement>
	) => {
		dispatch(
			physioFileActions.setExtubatedPatientPlanDescription(
				event.target.value
			)
		);
		dispatch(physioFileActions.setPhysioFileDataSaved(false));
	};

	return (
		<Checkbox.Group
			onChange={onCheckedChangeHandler}
			className={planStyles.checkboxGroup}
			defaultValue={defaultSelectedValues}>
			<Col className={planStyles.col}>
				{intubatedPatientPlan && (
					<Row
						align='middle'
						className={planStyles.row}
						style={{ marginBottom: "8px" }}>
						<Checkbox
							className={`${fileStyles.texts} ${planStyles.checkbox}`}
							style={{ fontWeight: 400 }}
							value={intubatedPatientPlan.id}>
							{intubatedPatientPlan.type}
						</Checkbox>
						{allPatientPlans[0].selected && (
							<TextArea
								value={intubatedPatientPlanDescription}
								autoSize={{ minRows: 1, maxRows: 2 }}
								onChange={handleChangeIntubatedDescription}
								onBlur={handleLoseFocusIntubated}
								placeholder={`${intubatedPatientPlan.type} planovi`}
								className={`${assessmentStyles.textArea}  ${planStyles.textArea}`}
							/>
						)}
					</Row>
				)}
				{extubatedPatientPlan && (
					<Row align='middle' className={planStyles.row}>
						<Checkbox
							className={`${fileStyles.texts} ${planStyles.checkbox}`}
							style={{ fontWeight: 400 }}
							value={extubatedPatientPlan.id}>
							{extubatedPatientPlan.type}
						</Checkbox>
						{allPatientPlans[1].selected && (
							<TextArea
								value={extubatedPatientPlanDescription}
								autoSize={{ minRows: 1, maxRows: 2 }}
								onChange={handleChangeExtubatedDescription}
								onBlur={handleLoseFocusExtubated}
								placeholder={`${extubatedPatientPlan.type} planovi`}
								className={`${assessmentStyles.textArea}  ${planStyles.textArea}`}
							/>
						)}
					</Row>
				)}
			</Col>
		</Checkbox.Group>
	);
};

export default PhysioPlans;
