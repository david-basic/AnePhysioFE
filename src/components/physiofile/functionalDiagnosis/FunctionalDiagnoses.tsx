import { useState, type FC } from "react";
import { type PatientFunctionalDiagnosisVM } from "../../../models/physiofile/functionalDiagnosis/PatientFunctionalDiagnosisVM";
import { Checkbox, Col, Modal, Row } from "antd";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import generateRandomNumber from "../../../util/generateRandomBigInteger";
import { PlusCircle } from "react-bootstrap-icons";
import localStyles from "./FunctionalDiagnoses.module.css";
import parentStyles from "../PhysioFile.module.css";
import { useAppDispatch } from "../../../hooks/use_app_dispatch";
import { physioFileActions } from "../../../store/physio-file-slice";

type FunctionalDiagnosesProps = {
	patientDiagnoses: PatientFunctionalDiagnosisVM[];
};

const FunctionalDiagnoses: FC<FunctionalDiagnosesProps> = ({
	patientDiagnoses,
}: FunctionalDiagnosesProps) => {
	const [showModal, setShowModal] = useState(false);
	const dispatch = useAppDispatch();

	const onCheckHandler = (checkedValues: CheckboxValueType[]) => {
		const newPatientFunctionalDiagnosesState: PatientFunctionalDiagnosisVM[] = [];
		const checkedSet = new Set(checkedValues);
		patientDiagnoses.forEach((pd) => {
			checkedSet.has(pd.name)
				? newPatientFunctionalDiagnosesState.push({
						name: pd.name,
						selected: true,
				  })
				: newPatientFunctionalDiagnosesState.push(pd);
		});

		dispatch(physioFileActions.setPatientFunctionalDiagnoses(newPatientFunctionalDiagnosesState));
		dispatch(physioFileActions.setDataSaved(false));
	};

	const handleShowModal = () => {
		setShowModal(true);
	};

	const handleSaveNewFunctionalDiagnosis = () => {
		console.log("TODO actions to save the new functional diagnosis");
	};

	const defaultSelectedValues: string[] = [];
	patientDiagnoses.map(
		(fd) => fd.selected && defaultSelectedValues.push(fd.name)
	);

	return (
		<Checkbox.Group
			onChange={onCheckHandler}
			defaultValue={defaultSelectedValues}>
			<Row>
				{patientDiagnoses.map((fd) => (
					<Col key={generateRandomNumber(6, true)} span={10}>
						<Checkbox
							className={parentStyles.texts}
							style={{ fontWeight: 400 }}
							value={fd.name}>
							{fd.name}
						</Checkbox>
					</Col>
				))}
				<Col span={8}>
					<span
						className={parentStyles.textsAsLinks}
						onClick={handleShowModal}>
						<PlusCircle
							className={parentStyles.iconButtonsInText}
						/>{" "}
						Dodaj novu
					</span>
					<Modal
						title='Dodaj novu funkcionalnu dijagnozu'
						centered
						maskClosable={false}
						open={showModal}
						onOk={handleSaveNewFunctionalDiagnosis}
						okText='Spremi'
						okButtonProps={{ type: "primary" }}
						cancelText='Odustani'
						closable={false}
						onCancel={() => setShowModal(false)}>
						<h2>
							Forma za dodavanje nove funkcionalne dijagnoze TODO
						</h2>
					</Modal>
				</Col>
			</Row>
		</Checkbox.Group>
	);
};

export default FunctionalDiagnoses;
