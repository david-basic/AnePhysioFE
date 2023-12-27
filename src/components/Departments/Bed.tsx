import { useState, type FC } from "react";
import { type BedVM } from "../../models/BedVM";
import { Link } from "react-router-dom";
import styles from "./Bed.module.css";
import { Col, Modal, Row, message } from "antd";
import { XSquare } from "react-bootstrap-icons";
import useFetchApi from "../../hooks/use_fetch_api";
import { ApiResponse } from "../../type";
import { PatientVM } from "../../models/PatientVM";
import api_routes from "../../config/api_routes";
import { HttpStatusCode } from "axios";
import LoadingSpinner from "../LoadingSpinner";

type BedProps = {
	bedNum: number;
} & BedVM;

const Bed: FC<BedProps> = ({ bedNum, patient }: BedProps) => {
	const [showModal, setShowModal] = useState(false);
	const [fetchedPatientData, setFetchedPatientData] = useState<PatientVM>();
	const { sendRequest: sendPatientDetailsRequest, isLoading } = useFetchApi();
	const dataToTransfer = {
		id: patient !== null ? patient!.id : null,
	};

	const handleRightClick = (event: any) => {
		event.preventDefault();

		setShowModal(true);

		sendPatientDetailsRequest(
			{
				url: api_routes.ROUTE_PATIENT_GET + `/${patient!.id}`,
				headers: { "Content-Type": "application/json" },
			},
			(patientDetailsResponseData: ApiResponse<PatientVM>) => {
				if (patientDetailsResponseData.status !== HttpStatusCode.Ok) {
					message.warning(patientDetailsResponseData.message);
				} else {
					console.log("Patient details response:");
					console.log(patientDetailsResponseData);
					setFetchedPatientData(patientDetailsResponseData.data);
				}
			}
		);
	};

	return (
		<Row>
			<Col span={22}>
				{patient !== null && (
					<>
						<Link
							to={"#linkToAPage"}
							className={styles["occupied-bed-text"]}
							state={dataToTransfer}
							onContextMenu={handleRightClick}>
							{`Bed ${bedNum}: ${
								patient!.firstName + " " + patient!.lastName
							}`}
						</Link>
						<Modal
							title={`${fetchedPatientData?.firstName} ${fetchedPatientData?.lastName} - ${fetchedPatientData?.identificationNumber}`}
							centered
							open={showModal}
							cancelButtonProps={{
								type: "primary",
							}}					
							okButtonProps={{ style: { visibility: "hidden", width: "0px" } }}
							onCancel={() => setShowModal(false)}>
							{isLoading && <LoadingSpinner />}
							{!isLoading && (
								<>
									<p>patient data</p>
									<p>patient data</p>
									<p>patient data</p>
									<p>patient data</p>
									<p>patient data</p>
									<p>patient data</p>
									<p>patient data</p>
									<p>patient data</p>
									<p>patient data</p>
									<p>patient data</p>
									<p>patient data</p>
									<p>patient data</p>
									<p>patient data</p>
									<p>patient data</p>
									<p>patient data</p>
									<p>patient data</p>
								</>
							)}
						</Modal>
					</>
				)}
				{patient === null && (
					<p
						className={
							styles["free-bed-text"]
						}>{`Bed ${bedNum}: empty bed`}</p>
				)}
			</Col>
			<Col span={2}>{patient === null && <XSquare />}</Col>
		</Row>
	);
};

export default Bed;
