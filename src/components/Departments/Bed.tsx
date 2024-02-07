import { useState, type FC } from "react";
import { type BedVM } from "../../models/department/BedVM";
import localStyles from "./Bed.module.css";
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
import CustomBedButton from "./CustomBedButton";

type BedProps = {} & BedVM;

const Bed: FC<BedProps> = ({ patient }: BedProps) => {
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
														localStyles[
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
														localStyles[
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
						<CustomBedButton
							to={client_routes.ROUTE_PATIENTS_DETAILS.replace(
								clientRoutesParams.patientId,
								patient!.id
							)}
							label={`${
								patient!.firstName + " " + patient!.lastName
							}`}
							bedIsEmpty={false}
							icon={
								<svg viewBox='0 0 640 512'>
									<path d='M176 288C220.1 288 256 252.1 256 208S220.1 128 176 128S96 163.9 96 208S131.9 288 176 288zM544 128H304C295.2 128 288 135.2 288 144V320H64V48C64 39.16 56.84 32 48 32h-32C7.163 32 0 39.16 0 48v416C0 472.8 7.163 480 16 480h32C56.84 480 64 472.8 64 464V416h512v48c0 8.837 7.163 16 16 16h32c8.837 0 16-7.163 16-16V224C640 170.1 597 128 544 128z'></path>
								</svg>
							}
							onContextMenu={handleRightClick}
						/>
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
					<CustomBedButton
						to='#'
						label={""}
						bedIsEmpty={true}
						icon={
							<svg viewBox='0 0 640 512'>
								<path d='M176 288C220.1 288 256 252.1 256 208S220.1 128 176 128S96 163.9 96 208S131.9 288 176 288zM544 128H304C295.2 128 288 135.2 288 144V320H64V48C64 39.16 56.84 32 48 32h-32C7.163 32 0 39.16 0 48v416C0 472.8 7.163 480 16 480h32C56.84 480 64 472.8 64 464V416h512v48c0 8.837 7.163 16 16 16h32c8.837 0 16-7.163 16-16V224C640 170.1 597 128 544 128z'></path>
							</svg>
						}
					/>
				)}
			</Col>
		</Row>
	);
};

export default Bed;
