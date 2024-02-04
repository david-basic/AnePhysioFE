import { useState, type FC } from "react";
import { type BedVM } from "../../models/department/BedVM";
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
import { type ApiResponse } from "../../type";
import dayjs from "dayjs";
import { type PatientVM } from "../../models/patient/PatientVM";
import api_routes from "../../config/api_routes";
import { HttpStatusCode } from "axios";
import LoadingSpinner from "../LoadingSpinner";
import constants from "../../config/constants";
import client_routes, { clientRoutesParams } from "../../config/client_routes";
import useFetcApihWithTokenRefresh from "../../hooks/use_fetch_api_with_token_refresh";

type BedProps = {
	bedNum: number;
} & BedVM;

const Bed: FC<BedProps> = ({ bedNum, patient }: BedProps) => {
	const [showModal, setShowModal] = useState(false);
	const [patientData, setPatientData] = useState<PatientVM>();
	const [descriptionItems, setDescriptionItems] = useState<
		DescriptionsProps["items"]
	>([]);
	const { fetchWithTokenRefresh: sendPatientDetailsRequest, isLoading } =
		useFetcApihWithTokenRefresh();
	const dateOptions: Intl.DateTimeFormatOptions = {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		timeZone: "CET",
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
					const fetchedPatientData: PatientVM =
						patientDetailsResponseData.data!;
					const items: DescriptionsProps["items"] = [
						{
							key: constants.DATE_OF_BIRTH,
							label: <b>{constants.DATE_OF_BIRTH}</b>,
							children: new Date(
								Date.parse(fetchedPatientData!.birthDate)
							)
								.toLocaleDateString("hr-HR", dateOptions)
								.split(" ")
								.join(""),
						},
						{
							key: constants.PATIENT_AGE,
							label: <b>{constants.PATIENT_AGE}</b>,
							children: fetchedPatientData!.patientAge,
						},
						{
							key: constants.SEX,
							label: <b>{constants.SEX}</b>,
							children: fetchedPatientData!.sex.displayName,
						},
						{
							key: constants.ADMISSION_DATE,
							label: <b>{constants.ADMISSION_DATE}</b>,
							children: dayjs(
								fetchedPatientData!.admissionDateTime
							).format("DD.MM.YYYY HH:mm:ss"),
						},
						{
							key: constants.PATIENT_ADDRESS,
							span: 2,
							label: <b>{constants.PATIENT_ADDRESS}</b>,
							children:
								fetchedPatientData!.patientAddress.fullAddress,
						},
						{
							key: constants.LEADING_DOCTOR,
							label: <b>{constants.LEADING_DOCTOR}</b>,
							children:
								fetchedPatientData!.leadingDoctor
									.fullNameAndTitles,
						},
						{
							key: constants.LEADING_MKB,
							span: 2,
							label: <b>{constants.LEADING_MKB}</b>,
							children: (
								<p>
									{fetchedPatientData?.leadingMkb.displayName}
								</p>
							),
						},
						{
							key: constants.PATIENT_MBKS,
							span: 3,
							label: <b>{constants.PATIENT_MBKS}</b>,
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
													{mkb.displayName}
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
							label: <b>{constants.OPERATIONS}</b>,
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
			<Col span={24}>
				{patient !== null && (
					<>
						<Link
							to={client_routes.ROUTE_PATIENTS_DETAILS.replace(
								clientRoutesParams.patientId,
								patient!.id
							)}
							className={styles["occupied-bed-text"]}
							onContextMenu={handleRightClick}>
							{`Bed ${bedNum}: ${
								patient!.firstName + " " + patient!.lastName
							}`}
						</Link>
						<Modal
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
							{!isLoading && (
								<Descriptions
									title={`Informacije pacijent${
										patientData?.sex.displayName.toLowerCase()[0] ===
										"f"
											? "ice"
											: "a"
									} ${patient?.firstName} ${
										patient?.lastName
									} - ${patientData?.identificationNumber}`}
									bordered
									column={3}
									size='small'
									style={{
										backgroundColor: "#d5e9f3",
										margin: "15px",
										padding: "20px",
										borderRadius: "8px",
									}}
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
		</Row>
	);
};

export default Bed;
