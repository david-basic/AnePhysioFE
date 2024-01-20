import { type FC } from "react";
import { type PatientFunctionalDiagnosisVM } from "../../../models/physiofile/functionalDiagnosis/PatientFunctionalDiagnosisVM";
import { Checkbox, Col, Row } from "antd";
import { type CheckboxValueType } from "antd/es/checkbox/Group";
import generateRandomNumber from "../../../util/generateRandomBigInteger";
import { PlusCircle } from "react-bootstrap-icons";
import parentStyles from "../PhysioFile.module.css";
import { useAppDispatch } from "../../../hooks/use_app_dispatch";
import { useAppSelector } from "../../../hooks/use_app_selector";
import { type PhysioFileVM } from "../../../models/physiofile/PhysioFileVM";
import FdModal from "./FdModal";
import { modalsShowActions } from "../../../store/modals-show-slice";
import { type FunctionalDiagnosisVM } from "../../../models/physiofile/functionalDiagnosis/FunctionalDiagnosisVM";
import { physioFileActions } from "../../../store/physio-file-slice";

type FunctionalDiagnosesProps = {
	physioFile: PhysioFileVM;
	patientFunctionalDiagnoses: PatientFunctionalDiagnosisVM[];
	fdList: FunctionalDiagnosisVM[] | undefined;
};

const FunctionalDiagnoses: FC<FunctionalDiagnosesProps> = ({
	physioFile,
	patientFunctionalDiagnoses,
	fdList,
}: FunctionalDiagnosesProps) => {
	const dispatch = useAppDispatch();
	const showFdModal = useAppSelector(
		(state) => state.modalsShowReducer.showFdModal
	);

	const onCheckHandler = (checkedValues: CheckboxValueType[]) => {
		const newPatientFunctionalDiagnosesState: PatientFunctionalDiagnosisVM[] =
			[];
		const checkedSet = new Set(checkedValues);
		patientFunctionalDiagnoses.forEach((patFuncDiag) => {
			checkedSet.has(patFuncDiag.id)
				? newPatientFunctionalDiagnosesState.push({
						id: patFuncDiag.id,
						selected: true,
						functionalDiagnosis: patFuncDiag.functionalDiagnosis,
				  })
				: newPatientFunctionalDiagnosesState.push({
						id: patFuncDiag.id,
						selected: false,
						functionalDiagnosis: patFuncDiag.functionalDiagnosis,
				  });
		});

		dispatch(
			physioFileActions.setPatientFunctionalDiagnoses(
				newPatientFunctionalDiagnosesState
			)
		);
		dispatch(physioFileActions.setPhysioFileDataSaved(false));
	};

	const defaultSelectedValues: string[] = [];
	patientFunctionalDiagnoses.map(
		(patientFuncDiag) =>
			patientFuncDiag.selected &&
			defaultSelectedValues.push(patientFuncDiag.id)
	);

	return (
		<Checkbox.Group
			onChange={onCheckHandler}
			defaultValue={defaultSelectedValues}>
			<Row>
				{patientFunctionalDiagnoses.map((patientFuncDiag) => (
					<Col key={generateRandomNumber(6, true)} span={10}>
						<Checkbox
							className={parentStyles.texts}
							style={{ fontWeight: 400 }}
							value={patientFuncDiag.id}>
							{patientFuncDiag.functionalDiagnosis.description}
						</Checkbox>
					</Col>
				))}
				<Col span={8}>
					<span
						className={parentStyles.textsAsLinks}
						onClick={() =>
							dispatch(modalsShowActions.setShowFdModal(true))
						}>
						<PlusCircle
							className={parentStyles.iconButtonsInText}
						/>{" "}
						Dodaj novu
					</span>
					<FdModal
						showModal={showFdModal}
						physioFile={physioFile}
						fdList={fdList}
					/>
				</Col>
			</Row>
		</Checkbox.Group>
	);
};

export default FunctionalDiagnoses;
