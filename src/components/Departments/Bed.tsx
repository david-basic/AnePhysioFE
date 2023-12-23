import { useState, type FC } from "react";
import { type BedVM } from "../../models/BedVM";
import { Link } from "react-router-dom";
import styles from "./Bed.module.css";
import { Col, Row } from "antd";
import { XSquare } from "react-bootstrap-icons";
import useFetchApi from "../../hooks/use_fetch_api";
import { ApiResponse } from "../../type";
import { PatientVM } from "../../models/PatientVM";

type BedProps = {
	bedNum: number;
} & BedVM;

const Bed: FC<BedProps> = ({ bedNum, patient }: BedProps) => {
	const [showModal, setShowModal] = useState(false);
	const { sendRequest: sendPatientDetailsRequest, isLoading } = useFetchApi();
	const dataToTransfer = {
		id: patient !== null ? patient!.id : null,
	};

	const handleRightClick = (event: any) => {
		event.preventDefault();

		sendPatientDetailsRequest(
			{
				url: "",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: "",
			},
			(patientDetailsResponseData: ApiResponse<PatientVM>) => {
				console.log(patientDetailsResponseData);
			}
		);
	};

	return (
		<Row>
			<Col span={22}>
				{patient !== null && (
					<Link
						to={"#linkToAPage"}
						className={styles["occupied-bed-text"]}
						state={dataToTransfer}
						onContextMenu={handleRightClick}>
						{`Bed ${bedNum}: ${
							patient!.firstName + " " + patient!.lastName
						}`}
					</Link>
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
