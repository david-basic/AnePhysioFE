import { Button, Modal, Row, Table, message } from "antd";
import { Header } from "antd/es/layout/layout";
import { Fragment, useEffect, useState, type FC } from "react";
import "dayjs/locale/hr";
import dayjs from "dayjs";
import Segment from "../physiofile/segments/Segment";
import LoadingSpinner from "../LoadingSpinner";
import { type PhysioFileVM } from "../../models/physiofile/PhysioFileVM";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/use_app_dispatch";
import useFetcApihWithTokenRefresh from "../../hooks/use_fetch_api_with_token_refresh";
import modalStyles from "../modals/ModalStyles.module.css";
import { modalsShowActions } from "../../store/modals-show-slice";
import ChoosePhysioFilePatientDetails from "./ChoosePhysioFilePatientDetails";
import { ColumnsType } from "antd/es/table";
import generateRandomNumber from "../../util/generateRandomBigInteger";
import { useAppSelector } from "../../hooks/use_app_selector";
import client_routes, { clientRoutesParams } from "../../config/client_routes";
import { HttpStatusCode } from "axios";
import { ApiResponse } from "../../type";
import api_routes from "../../config/api_routes";

type ChoosePhysioFileModalProps = {
	showModal: boolean;
	loadingData: boolean;
	physioFilesList: PhysioFileVM[];
	departmentName: string;
};

type DateTimeType = {
	date: string;
	time: string;
};

type PhysioFileAndDepartmentNameType = {
	physioFile: PhysioFileVM;
	departmentName: string;
};

type TableColumnDefinitionType = {
	key: string;
	id: string;
	admissionDateTime: DateTimeType;
	dischargeDateTime: DateTimeType | undefined;
	physioFileAndDepartmentName: PhysioFileAndDepartmentNameType;
	protocolId: string;
	physioFileClosedBy: string;
};

const ChoosePhysioFileModal: FC<ChoosePhysioFileModalProps> = ({
	showModal,
	loadingData,
	physioFilesList,
	departmentName,
}: ChoosePhysioFileModalProps) => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { fetchWithTokenRefresh, isLoading } = useFetcApihWithTokenRefresh();
	const [tableDataSet, setTableDataSet] = useState<
		TableColumnDefinitionType[]
	>([]);
	const currentPatientId = useAppSelector(
		(state) => state.physioFileReducer.currentPatientId
	);
	const dateOptions: Intl.DateTimeFormatOptions = {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		timeZone: "CET",
	};

	useEffect(() => {
		physioFilesList !== null &&
			physioFilesList.forEach((pf) => {
				const admissionDateTime = dayjs(
					pf.patient.admissionDateTime
				).format("YYYY-MM-DD HH:mm:ss");

				const fetchedAdmissionDateTime: DateTimeType = {
					date: admissionDateTime.split(" ")[0],
					time: admissionDateTime.split(" ")[1],
				};

				let dischargeDateTime: string | undefined;
				let fetchedDischargeDateTime: DateTimeType | undefined;

				if (pf.fileClosedAt !== null) {
					dischargeDateTime = dayjs(pf.fileClosedAt).format(
						"YYYY-MM-DD HH:mm:ss"
					);
					fetchedDischargeDateTime = {
						date: dischargeDateTime.split(" ")[0],
						time: dischargeDateTime.split(" ")[1],
					};
				}

				setTableDataSet((prev) => {
					const newState = [...prev];
					newState.push({
						key: generateRandomNumber(9, true)!,
						id: pf.id,
						admissionDateTime: fetchedAdmissionDateTime,
						dischargeDateTime: fetchedDischargeDateTime,
						physioFileAndDepartmentName: {
							departmentName: `Fizioterapeutski karton - ${departmentName}`,
							physioFile: pf,
						},
						protocolId: generateRandomNumber(4)!,
						physioFileClosedBy:
							pf.fileClosedBy !== null
								? pf.fileClosedBy.lastName
								: "",
					});

					return newState;
				});
			});

		return () => {
			setTableDataSet([]);
		};
	}, [departmentName, physioFilesList]);

	const columns: ColumnsType<TableColumnDefinitionType> = [
		{
			key: "admissionDate",
			title: "Datum prijema",
			dataIndex: "admissionDateTime",
			width: 25,
			sorter: (a, b) => {
				const dateA = dayjs(
					`${a.admissionDateTime.date} ${a.admissionDateTime.time}`
				);
				const dateB = dayjs(
					`${b.admissionDateTime.date} ${b.admissionDateTime.time}`
				);

				return dateA.isBefore(dateB)
					? -1
					: dateA.isAfter(dateB)
					? 1
					: 0;
			},
			render: (_, { admissionDateTime }) => (
				<span>
					{new Date(Date.parse(admissionDateTime.date))
						.toLocaleDateString("hr-HR", dateOptions)
						.split(" ")
						.join("")}
				</span>
			),
		},
		{
			key: "dischargeDate",
			title: "Datum otpusta",
			dataIndex: "dischargeDateTime",
			width: 25,
			sorter: (a, b) => {
				if (
					a.dischargeDateTime !== undefined &&
					b.dischargeDateTime !== undefined
				) {
					const dateA = dayjs(
						`${a.dischargeDateTime.date} ${a.dischargeDateTime.time}`
					);
					const dateB = dayjs(
						`${b.dischargeDateTime.date} ${b.dischargeDateTime.time}`
					);

					return dateA.isBefore(dateB)
						? -1
						: dateA.isAfter(dateB)
						? 1
						: 0;
				}

				return -1; //TODO check if maybe has to be 1 or 0 -> want to have it last if it is undefined
			},
			render: (_, { dischargeDateTime }) => (
				<span>
					{dischargeDateTime !== undefined && (
						<Fragment>
							{new Date(
								Date.parse(dischargeDateTime.date)
							).toLocaleDateString("hr-HR", dateOptions)}
						</Fragment>
					)}
					{dischargeDateTime === undefined && ""}
				</span>
			),
		},
		{
			key: "file",
			title: "Nalaz",
			width: 120,
			dataIndex: "physioFileAndDepartmentName",
			render: (_, { physioFileAndDepartmentName }) => (
				<NavLink
					to={client_routes.ROUTE_PHYSIO_FILE_BY_ID.replace(
						clientRoutesParams.physioFileId,
						physioFileAndDepartmentName.physioFile.id
					)}>
					{physioFileAndDepartmentName.departmentName}
				</NavLink>
			),
		},
		{
			key: "protokol",
			title: "Protokol ID",
			width: 25,
			dataIndex: "protocolId",
			render: (_, { protocolId }) => <span>{protocolId}</span>,
		},
		{
			key: "physioFileClosed",
			title: "Zaključio/la",
			width: 25,
			dataIndex: "physioFileClosedBy",
			render: (_, { physioFileClosedBy }) => (
				<span>{physioFileClosedBy}</span>
			),
		},
	];

	const newPhysioFileClickHandler = () => {
		try {
			fetchWithTokenRefresh(
				{
					url:
						api_routes.ROUTE_PHYSIO_FILE_GET_LATEST_ACTIVE_OR_CREATE_NEW_BY_PATIENT_ID +
						`/${currentPatientId}`,
					headers: { "Content-Type": "application/json" },
				},
				(physioFileResponse: ApiResponse<PhysioFileVM>) => {
					if (physioFileResponse.status !== HttpStatusCode.Ok) {
						message.error(
							"Nije moguće kreirati fizioterapeutski karton pacijenta!"
						);
						message.error(physioFileResponse.message);
						console.error(
							"There was a error while creating physio file: ",
							physioFileResponse
						);
					} else {
						message.success(
							"Kreiran fizioterapeutski karton pacijenta!"
						);
						navigate(
							client_routes.ROUTE_PHYSIO_FILE_BY_ID.replace(
								clientRoutesParams.physioFileId,
								physioFileResponse.data!.id
							)
						);
					}
				}
			);
		} catch (error) {
			console.error("Error creating physio file:", error);
			message.error(
				"Neuspjelo kreiranje fizioterapeutskog kartona pacijenta!"
			);
		}
	};

	return (
		<Modal
			centered
			className={modalStyles.modalsWidth}
			styles={{
				mask: {
					backgroundColor: "rgba(0, 0, 0, 0.1)",
				},
			}}
			open={showModal}
			closeIcon={<span></span>}
			okButtonProps={{ style: { display: "none" } }}
			cancelButtonProps={{ type: "primary" }}
			onCancel={() =>
				dispatch(modalsShowActions.setShowChoosePhysioFileModal(false))
			}
			cancelText='Odustani'>
			<Header className={modalStyles.modalsHeader}>
				{(!physioFilesList || loadingData) && <LoadingSpinner />}
				{physioFilesList && !loadingData && (
					<ChoosePhysioFilePatientDetails
						patientData={physioFilesList[0].patient}
					/>
				)}
			</Header>
			<Segment>
				{(!physioFilesList || loadingData || isLoading) && (
					<LoadingSpinner />
				)}
				{physioFilesList && !loadingData && !isLoading && (
					<Segment isContent>
						<Table
							pagination={false}
							dataSource={tableDataSet}
							virtual
							scroll={{ y: 400, x: undefined }}
							columns={columns}
							className={modalStyles.choosePhysioFileModalTable}
							size='small'
						/>
						{physioFilesList.filter(
							(pf) => pf.fileClosedBy !== null
						).length ===
							physioFilesList.filter(
								(pf) => pf.fileOpenedBy !== null
							).length && (
							<Row
								justify={"center"}
								align={"middle"}
								style={{ marginTop: "20px" }}>
								<Button
									type='primary'
									onClick={newPhysioFileClickHandler}>
									Dodaj novi karton
								</Button>
							</Row>
						)}
					</Segment>
				)}
			</Segment>
		</Modal>
	);
};

export default ChoosePhysioFileModal;
