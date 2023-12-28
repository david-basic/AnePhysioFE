import { useState, type FC } from "react";
import { type BedVM } from "../../models/BedVM";
import { Link } from "react-router-dom";
import styles from "./Bed.module.css";
import {
	Col,
	Descriptions,
	DescriptionsProps,
	Modal,
	Row,
	message,
} from "antd";
import { XSquare } from "react-bootstrap-icons";
import useFetchApi from "../../hooks/use_fetch_api";
import { type ApiResponse } from "../../type";
import { type PatientVM } from "../../models/PatientVM";
import api_routes from "../../config/api_routes";
import { HttpStatusCode } from "axios";
import LoadingSpinner from "../LoadingSpinner";
import constants from "../../config/constants";
// import useRefreshCurrentToken from "../../hooks/refreshCurrentToken";

type BedProps = {
	bedNum: number;
} & BedVM;

const Bed: FC<BedProps> = ({ bedNum, patient }: BedProps) => {
	const [showModal, setShowModal] = useState(false);
	const [patientData, setPatientData] = useState<PatientVM>();
	const [descriptionItems, setDescriptionItems] = useState<
		DescriptionsProps["items"]
	>([]);
	const { sendRequest: sendPatientDetailsRequest, isLoading } = useFetchApi();
	// const { sendRefreshTokenRequest } = useRefreshCurrentToken();
	const dataToTransfer = {
		id: patient !== null ? patient!.id : null,
	};
	const dateOptions: Intl.DateTimeFormatOptions = {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	};

	const handleRightClick = (event: any) => {
		event.preventDefault();

		// sendRefreshTokenRequest();

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
					const fetchedPatientData: PatientVM =
						patientDetailsResponseData.data!;
					const items: DescriptionsProps["items"] = [
						{
							key: constants.DATE_OF_BIRTH,
							label: constants.DATE_OF_BIRTH,
							children: new Date(
								Date.parse(fetchedPatientData!.birthDate)
							).toLocaleDateString("hr-HR", dateOptions),
						},
						{
							key: constants.PATIENT_AGE,
							label: constants.PATIENT_AGE,
							children: fetchedPatientData!.patientAge,
						},
						{
							key: constants.SEX,
							label: constants.SEX,
							children: fetchedPatientData!.sex.displayName,
						},
						{
							key: constants.ADMISSION_DATE,
							label: constants.ADMISSION_DATE,
							children: new Date(
								Date.parse(
									fetchedPatientData!.admissionDateTime
								)
							).toLocaleString("hr-HR", { timeZone: "UTC" }),
						},
						{
							key: constants.PATIENT_ADDRESS,
							span: 2,
							label: constants.PATIENT_ADDRESS,
							children:
								fetchedPatientData!.patientAddress.fullAddress,
						},
						{
							key: constants.LEADING_DOCTOR,
							label: constants.LEADING_DOCTOR,
							children:
								fetchedPatientData!.leadingDoctor
									.fullNameAndTitles,
						},
						{
							key: constants.LEADING_MKB,
							span: 2,
							label: constants.LEADING_MKB,
							children: (
								<p>
									{fetchedPatientData?.leadingMkb.code}{" "}
									{fetchedPatientData?.leadingMkb.displayName}
								</p>
							),
						},
						{
							key: constants.PATIENT_MBKS,
							span: 3,
							label: constants.PATIENT_MBKS,
							children: (
								<ul>
									{fetchedPatientData!.patientMkbs.length >
										1 &&
										fetchedPatientData!.patientMkbs.map(
											(mkb) => (
												<li
													key={mkb.id}
													className={
														styles[
															"remove-list-style"
														]
													}>
													{mkb.code} {mkb.displayName}
													<hr />
												</li>
											)
										)}
									{fetchedPatientData!.patientMkbs.length <=
										1 && <p>Nema drugih dijagnoza</p>}
								</ul>
							),
						},
						{
							key: constants.OPERATIONS,
							span: 3,
							label: constants.OPERATIONS,
							children: (
								<ul>
									{fetchedPatientData?.operations !== null &&
										fetchedPatientData!.operations!.map(
											(op) => (
												<li
													key={op.id}
													className={
														styles[
															"remove-list-style"
														]
													}>
													{new Date(
														Date.parse(
															op.procedureDate
														)
													).toLocaleDateString(
														"hr-HR",
														dateOptions
													)}{" "}
													{op.procedureName}
													<hr />
												</li>
											)
										)}
									{fetchedPatientData?.operations == null && (
										<p>Nema obavljenih operacija</p>
									)}
								</ul>
							),
						},
					];
					setDescriptionItems(items);
					setPatientData(fetchedPatientData);
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
							title={`${patient?.firstName} ${patient?.lastName} - ${patientData?.identificationNumber}`}
							centered
							width='auto'
							open={showModal}
							cancelButtonProps={{
								type: "primary",
							}}
							okButtonProps={{
								style: { visibility: "hidden", width: "0px" },
							}}
							onCancel={() => setShowModal(false)}>
							{isLoading && <LoadingSpinner />}
							{}
							{!isLoading && (
								<Descriptions
									title='Informacije pacijenta'
									bordered
									column={3}
									size='small'
									items={descriptionItems}
								/>
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
