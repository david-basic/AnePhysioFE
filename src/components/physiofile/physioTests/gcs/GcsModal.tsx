import { Fragment, useEffect, useState, type FC } from "react";
import { PhysioFileVM } from "../../../../models/physiofile/PhysioFileVM";
import { PhysioTestVM } from "../../../../models/physiofile/physioTests/PhysioTestVM";
import { EyeOpeningResponseVM } from "../../../../models/physiofile/physioTests/gcs/EyeOpeningResponseVM";
import { MotorResponseVM } from "../../../../models/physiofile/physioTests/gcs/MotorResponseVM";
import { VerbalResponseVM } from "../../../../models/physiofile/physioTests/gcs/VerbalResponseVM";
import {
	Button,
	Col,
	DatePicker,
	DatePickerProps,
	Modal,
	Row,
	Space,
	Table,
	Tooltip,
	message,
} from "antd";
import "dayjs/locale/hr";
import dayjs, { type Dayjs } from "dayjs";
import croLocale from "antd/es/date-picker/locale/hr_HR";
import { useAppDispatch } from "../../../../hooks/use_app_dispatch";
import useFetcApihWithTokenRefresh from "../../../../hooks/use_fetch_api_with_token_refresh";
import { useAppSelector } from "../../../../hooks/use_app_selector";
import { SaveFilled } from "@ant-design/icons";
import modalStyles from "../../../modals/ModalStyles.module.css";
import fileStyles from "../../PhysioFile.module.css";
import { InfoCircleFill, PencilFill, X } from "react-bootstrap-icons";
import { modalsShowActions } from "../../../../store/modals-show-slice";
import { Header } from "antd/es/layout/layout";
import Segment from "../../segments/Segment";
import generateRandomNumber from "../../../../util/generateRandomBigInteger";
import api_routes from "../../../../config/api_routes";
import { ApiResponse, NoReturnData } from "../../../../type";
import { HttpStatusCode } from "axios";
import { physioFileActions } from "../../../../store/physio-file-slice";
import confirm from "antd/es/modal/confirm";
import LoadingSpinner from "../../../LoadingSpinner";
import isNullOrEmpty from "../../../../util/isNullOrEmpty";
import { ListGroup } from "react-bootstrap";
import { UpdateGcsRequestDto } from "../../../../dto/PhysioFile/PhysioTest/Gcs/UpdateGcsRequestDto";
import { CreateGcsRequestDto } from "../../../../dto/PhysioFile/PhysioTest/Gcs/CreateGcsRequestDto";
import { ColumnsType } from "antd/es/table";
import { DeleteGcsRequestDto } from "../../../../dto/PhysioFile/PhysioTest/Gcs/DeleteGcsRequestDto";

type GcsModalProps = {
	showModal: boolean;
	physioFile: PhysioFileVM;
	physioTest: PhysioTestVM | null;
	gcsEyeResponses: EyeOpeningResponseVM[];
	gcsMotorResponses: MotorResponseVM[];
	gcsVerbalResponses: VerbalResponseVM[];
};

export type GcsDateTimeType = {
	date: string;
	time: string;
};

export type EyeResponseAndIndex = {
	eyeResponse: EyeOpeningResponseVM;
	index: number | undefined;
};
export type MotorResponseAndIndex = {
	motorResponse: MotorResponseVM;
	index: number | undefined;
};
export type VerbalResponseAndIndex = {
	verbalResponse: VerbalResponseVM;
	index: number | undefined;
};

export type GcsTableType = {
	eyeResponseAndIndex: EyeResponseAndIndex;
	motorResponseAndIndex: MotorResponseAndIndex;
	verbalResponseAndIndex: VerbalResponseAndIndex;
};

type TableColumnDefinitionType = {
	key: string;
	id: string;
	dateTime: GcsDateTimeType;
	gcs: GcsTableType;
};

type ChosenERandIndex = {
	chosenER: EyeOpeningResponseVM | undefined;
	index: number | undefined;
};
type ChosenVRandIndex = {
	chosenVR: VerbalResponseVM | undefined;
	index: number | undefined;
};
type ChosenMRandIndex = {
	chosenMR: MotorResponseVM | undefined;
	index: number | undefined;
};

const GcsModal: FC<GcsModalProps> = ({
	showModal,
	physioFile,
	physioTest,
	gcsEyeResponses,
	gcsMotorResponses,
	gcsVerbalResponses,
}: GcsModalProps) => {
	const dispatch = useAppDispatch();
	const { fetchWithTokenRefresh } = useFetcApihWithTokenRefresh();
	const [tableIsBeingEdited, setTableIsBeingEdited] =
		useState<boolean>(false);
	const [dataSavedToTable, setDataSavedToTable] = useState<
		TableColumnDefinitionType[]
	>([]);
	const [clickedEyeResponseIndex, setClickedEyeResponseIndex] =
		useState<number>();
	const [chosenEyeResponseAndIndex, setChosenEyeResponseAndIndex] =
		useState<ChosenERandIndex>({ chosenER: undefined, index: undefined });
	const [clickedVerbalResponseIndex, setClickedVerbalResponseIndex] =
		useState<number>();
	const [chosenVerbalResponseAndIndex, setChosenVerbalResponseAndIndex] =
		useState<ChosenVRandIndex>({ chosenVR: undefined, index: undefined });
	const [chosenMotorResponseAndIndex, setChosenMotorResponseAndIndex] =
		useState<ChosenMRandIndex>({ chosenMR: undefined, index: undefined });
	const [clickedMotorResponseIndex, setClickedMotorResponseIndex] =
		useState<number>();
	useState<ChosenMRandIndex>({ chosenMR: undefined, index: undefined });
	const [apiCallMade, setApiCallMade] = useState(true);
	const [tableRecordBeingEdited, setTableRecordBeingEdited] =
		useState<TableColumnDefinitionType>();
	const [datePickerValue, setDatePickerValue] = useState<Dayjs | null>(null);
	const [chosenDateTime, setChosenDateTime] = useState<GcsDateTimeType>({
		date: "",
		time: "",
	});
	const gcsModalDataSaved = useAppSelector(
		(state) => state.physioFileReducer.gcsModalDataSaved
	);
	const dateOptions: Intl.DateTimeFormatOptions = {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		timeZone: "CET",
	};

	useEffect(() => {
		physioFile.physioTest !== null
			? physioFile.physioTest.gcs.forEach((g) => {
					const gcsDateTime = dayjs(g.gcsDateTime).format(
						"YYYY.MM.DD HH:mm:ss"
					);
					const fetchedDateTime: GcsDateTimeType = {
						date: gcsDateTime.split(" ")[0],
						time: gcsDateTime.split(" ")[1],
					};

					const ERandIndex: EyeResponseAndIndex = {
						eyeResponse: {
							id: "",
							scale: g.eyeOpeningResponse.scale,
							score: g.eyeOpeningResponse.score,
						},
						index: gcsEyeResponses.findIndex(
							(er) => er.score === g.eyeOpeningResponse.score
						),
					};

					const VRandIndex: VerbalResponseAndIndex = {
						verbalResponse: {
							id: "",
							scale: g.verbalResponse.scale,
							score: g.verbalResponse.score,
						},
						index: gcsVerbalResponses.findIndex(
							(vr) => vr.score === g.verbalResponse.score
						),
					};

					const MRandIndex: MotorResponseAndIndex = {
						motorResponse: {
							id: "",
							scale: g.motorResponse.scale,
							score: g.motorResponse.score,
						},
						index: gcsMotorResponses.findIndex(
							(mr) => mr.score === g.motorResponse.score
						),
					};

					setDataSavedToTable((prevState) => {
						const newState = [...prevState];
						newState.push({
							key: generateRandomNumber(9, true)!,
							id: g.id,
							gcs: {
								eyeResponseAndIndex: ERandIndex,
								verbalResponseAndIndex: VRandIndex,
								motorResponseAndIndex: MRandIndex,
							},
							dateTime: fetchedDateTime,
						});

						return newState;
					});
			  })
			: apiCallMade &&
			  fetchWithTokenRefresh(
					{
						url:
							api_routes.ROUTE_PHYSIO_TEST_CREATE_NEW_BY_PHYSIO_FILE_ID +
							`/${physioFile.id}`,
						headers: { "Content-Type": "application/json" },
					},
					(physioFileResponse: ApiResponse<PhysioFileVM>) => {
						if (
							physioFileResponse.status !== HttpStatusCode.Created
						) {
							console.error(
								"There was a error creating physio test: ",
								physioFileResponse
							);
						} else {
							dispatch(
								physioFileActions.setPhysioFile(
									physioFileResponse.data!
								)
							);
							dispatch(
								physioFileActions.setGcsModalDataSaved(false)
							);
						}
					}
			  );

		return () => {
			setDataSavedToTable([]);
			setApiCallMade(false);
		};
	}, [
		apiCallMade,
		dispatch,
		fetchWithTokenRefresh,
		gcsEyeResponses,
		gcsMotorResponses,
		gcsVerbalResponses,
		physioFile.id,
		physioFile.physioTest,
	]);

	const columns: ColumnsType<TableColumnDefinitionType> = [
		{
			key: "gcsId",
			width: 1,
			dataIndex: "id",
			render: (_, { id }) => (
				<div style={{ visibility: "hidden", width: 0, height: 0 }}>
					{id}
				</div>
			),
		},
		{
			key: "gcsDateTime",
			title: "Datum",
			dataIndex: "dateTime",
			width: 25,
			sorter: (a, b) => {
				const dateA = dayjs(`${a.dateTime.date} ${a.dateTime.time}`);
				const dateB = dayjs(`${b.dateTime.date} ${b.dateTime.time}`);

				return dateA.isBefore(dateB)
					? -1
					: dateA.isAfter(dateB)
					? 1
					: 0;
			},
			render: (_, { dateTime }) => (
				<span>
					{new Date(Date.parse(dateTime.date))
						.toLocaleDateString("hr-HR", dateOptions)
						.split(" ")
						.join("")}
				</span>
			),
		},
		{
			key: "gcs",
			title: "Ocjene",
			dataIndex: "gcs",
			width: 70,
			render: (_, { gcs }) => (
				<Tooltip
					title={`E - ${gcs.eyeResponseAndIndex.eyeResponse.scale}, V - ${gcs.verbalResponseAndIndex.verbalResponse.scale}, M - ${gcs.motorResponseAndIndex.motorResponse.scale}`}>
					<span>
						Ukupno:{" "}
						{gcs.eyeResponseAndIndex.eyeResponse.score +
							gcs.verbalResponseAndIndex.verbalResponse.score +
							gcs.motorResponseAndIndex.motorResponse.score}{" "}
						(Očna: {gcs.eyeResponseAndIndex.eyeResponse.score},
						Verbalna:{" "}
						{gcs.verbalResponseAndIndex.verbalResponse.score},
						Motorička:{" "}
						{gcs.motorResponseAndIndex.motorResponse.score})
					</span>
				</Tooltip>
			),
		},
		{
			key: "actions",
			title: "Akcije",
			width: 25,
			render: (_, record) => (
				<Space size={"small"}>
					<Button
						type='primary'
						disabled={
							tableIsBeingEdited ||
							physioFile.fileClosedBy !== null
						}
						onClick={(e) => handleEditChoice(e, record)}
						icon={<PencilFill className={modalStyles.icon} />}
					/>
					<Button
						type='primary'
						disabled={
							tableIsBeingEdited ||
							physioFile.fileClosedBy !== null
						}
						danger
						onClick={(e) => handleDeleteChoice(e, record)}
						icon={<X className={modalStyles.icon} />}
					/>
				</Space>
			),
		},
	];

	const sendCreateGcsRequest = async (createDto: CreateGcsRequestDto) => {
		try {
			fetchWithTokenRefresh(
				{
					url: api_routes.ROUTE_PHYSIO_TEST_ADD_NEW_GCS,
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: createDto,
				},
				(physioFileResponse: ApiResponse<PhysioFileVM>) => {
					if (physioFileResponse.status !== HttpStatusCode.Created) {
						message.error("Nije moguće spremiti novi GCS!");
						console.error(
							"There was a error while saving new GCS: ",
							physioFileResponse
						);
					} else {
						addRecordToTable(
							chosenEyeResponseAndIndex,
							chosenVerbalResponseAndIndex,
							chosenMotorResponseAndIndex,
							chosenDateTime
						);

						dispatch(
							physioFileActions.setPhysioFile(
								physioFileResponse.data!
							)
						);
						message.success("Novi GCS uspješno spremljen!");
						dispatch(physioFileActions.setGcsModalDataSaved(false));
					}
				}
			);
		} catch (error) {
			console.error("Error posting new GCS:", error);
			message.error("Neuspjelo spremanje novog GCS-a!");
		}
	};

	const sendUpdateGcsRequest = async (
		gcsId: string,
		updateDto: UpdateGcsRequestDto
	) => {
		try {
			fetchWithTokenRefresh(
				{
					url:
						api_routes.ROUTE_PHYSIO_TEST_UPDATE_GCS_BY_ID +
						`/${gcsId}`,
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: updateDto,
				},
				(physioFileResponse: ApiResponse<PhysioFileVM>) => {
					if (physioFileResponse.status !== HttpStatusCode.Ok) {
						message.error("Nije moguće izmjeniti GCS!");
						console.error(
							"There was a error while updating GCS: ",
							physioFileResponse
						);
					} else {
						deleteRecordFromTable(tableRecordBeingEdited!);

						addRecordToTable(
							chosenEyeResponseAndIndex,
							chosenVerbalResponseAndIndex,
							chosenMotorResponseAndIndex,
							chosenDateTime
						);

						dispatch(
							physioFileActions.setPhysioFile(
								physioFileResponse.data!
							)
						);
						message.success("GCS uspješno izmijenjen!");
						dispatch(physioFileActions.setGcsModalDataSaved(false));
					}
				}
			);
		} catch (error) {
			console.error("Error updating GCS:", error);
			message.error("Neuspjela izmjena GCS-a!");
		}
	};

	const sendDeletePatientGcsRequest = (
		deleteDto: DeleteGcsRequestDto,
		recordToDelete: TableColumnDefinitionType
	) => {
		try {
			fetchWithTokenRefresh(
				{
					url: api_routes.ROUTE_PHYSIO_TEST_DELETE_GCS,
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: deleteDto,
				},
				(deleteFileResponse: ApiResponse<NoReturnData>) => {
					if (deleteFileResponse.status !== HttpStatusCode.Ok) {
						message.error("Nije moguće izbrisati GCS!");
						console.error(
							"There was a error while deleting GCS: ",
							deleteFileResponse
						);
					} else {
						const newData = dataSavedToTable.filter(
							(item) => item.key !== recordToDelete.key
						);
						setDataSavedToTable(newData);
						dispatch(physioFileActions.setGcsModalDataSaved(false));

						message.success("GCS uspješno izbrisan!");
					}
				}
			);
		} catch (error) {
			console.error("Error deleting GCS:", error);
			message.error("Neuspjelo brisanje GCS-a!");
		}
	};

	const addRecordToTable = (
		ERandIndex: ChosenERandIndex,
		VRandIndex: ChosenVRandIndex,
		MRandIndex: ChosenMRandIndex,
		chosenDateTime: GcsDateTimeType
	) => {
		setDataSavedToTable((prevState) => {
			const newState = [...prevState];
			const randNum = generateRandomNumber(12)!;
			newState.push({
				key: randNum,
				id: "",
				gcs: {
					eyeResponseAndIndex: {
						eyeResponse: ERandIndex.chosenER!,
						index: ERandIndex.index!,
					},
					verbalResponseAndIndex: {
						verbalResponse: VRandIndex.chosenVR!,
						index: VRandIndex.index!,
					},
					motorResponseAndIndex: {
						motorResponse: MRandIndex.chosenMR!,
						index: MRandIndex.index!,
					},
				},
				dateTime: chosenDateTime,
			});

			return newState;
		});
	};

	const deleteRecordFromTable = (
		recordToDelete: TableColumnDefinitionType
	) => {
		const newData = dataSavedToTable.filter(
			(item) => item.key !== recordToDelete.key
		);
		setDataSavedToTable(newData);
	};

	const onDatePickerChange: DatePickerProps["onChange"] = (
		date,
		dateString
	) => {
		if (isNullOrEmpty(dateString)) {
			setChosenDateTime({ date: "", time: "" });
			setDatePickerValue(null);
			return;
		}

		const currentTime = dayjs().format("HH:mm:ss");

		setDatePickerValue(date);
		setChosenDateTime({ date: dateString, time: currentTime });
	};

	const handleEyeResponseClick = (
		event: React.MouseEvent<Element, MouseEvent>,
		index: number
	) => {
		const clickedEyeResponseScore = parseInt(
			event.currentTarget.ariaValueText!
		);

		setClickedEyeResponseIndex((prevClickedIndex) => {
			let newClickedIndex = prevClickedIndex;

			if (newClickedIndex === index) {
				newClickedIndex = undefined;
				setChosenEyeResponseAndIndex({
					chosenER: undefined,
					index: undefined,
				});
			} else {
				newClickedIndex = index;

				const foundER = gcsEyeResponses.find(
					(er) => er.score === clickedEyeResponseScore
				);

				setChosenEyeResponseAndIndex({
					chosenER: foundER!,
					index: index,
				});
			}

			return newClickedIndex;
		});
	};

	const handleVerbalResponseClick = (
		event: React.MouseEvent<Element, MouseEvent>,
		index: number
	) => {
		const clickedVerbalResponseScore = parseInt(
			event.currentTarget.ariaValueText!
		);

		setClickedVerbalResponseIndex((prevClickedIndex) => {
			let newClickedIndex = prevClickedIndex;

			if (newClickedIndex === index) {
				newClickedIndex = undefined;
				setChosenVerbalResponseAndIndex({
					chosenVR: undefined,
					index: undefined,
				});
			} else {
				newClickedIndex = index;
				const foundVR = gcsVerbalResponses.find(
					(vr) => vr.score === clickedVerbalResponseScore
				);

				setChosenVerbalResponseAndIndex({
					chosenVR: foundVR!,
					index: index,
				});
			}

			return newClickedIndex;
		});
	};

	const handleMotorResponseClick = (
		event: React.MouseEvent<Element, MouseEvent>,
		index: number
	) => {
		const clickedMotorResponseScore = parseInt(
			event.currentTarget.ariaValueText!
		);

		setClickedMotorResponseIndex((prevClickedIndex) => {
			let newClickedIndex = prevClickedIndex;

			if (newClickedIndex === index) {
				newClickedIndex = undefined;
				setChosenMotorResponseAndIndex({
					chosenMR: undefined,
					index: undefined,
				});
			} else {
				newClickedIndex = index;
				const foundMR = gcsMotorResponses.find(
					(mr) => mr.score === clickedMotorResponseScore
				);

				setChosenMotorResponseAndIndex({
					chosenMR: foundMR!,
					index: index,
				});
			}

			return newClickedIndex;
		});
	};

	const handleSaveChoice = () => {
		if (
			isNullOrEmpty(chosenDateTime.date) ||
			chosenEyeResponseAndIndex.chosenER === undefined ||
			chosenVerbalResponseAndIndex.chosenVR === undefined ||
			chosenMotorResponseAndIndex.chosenMR === undefined
		) {
			return;
		}

		if (tableIsBeingEdited) {
			const updateDto: UpdateGcsRequestDto = {
				physioTestId: physioTest!.id,
				eyeOpeningResponse: chosenEyeResponseAndIndex.chosenER!,
				verbalResponse: chosenVerbalResponseAndIndex.chosenVR!,
				motorResponse: chosenMotorResponseAndIndex.chosenMR!,
				gcsDateTime: dayjs(
					`${chosenDateTime.date} ${chosenDateTime.time}`
				).format("YYYY-MM-DDTHH:mm:ss"),
			};

			sendUpdateGcsRequest(tableRecordBeingEdited!.id, updateDto);
		} else {
			const createDto: CreateGcsRequestDto = {
				physioTestId: physioTest!.id,
				eyeOpeningResponse: chosenEyeResponseAndIndex.chosenER!,
				verbalResponse: chosenVerbalResponseAndIndex.chosenVR!,
				motorResponse: chosenMotorResponseAndIndex.chosenMR!,
				gcsDateTime: dayjs(
					`${chosenDateTime.date} ${chosenDateTime.time}`
				).format("YYYY-MM-DDTHH:mm:ss"),
			};

			sendCreateGcsRequest(createDto);
		}

		resetModalStates();
	};

	const handleEditChoice = (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		tableRecord: TableColumnDefinitionType
	) => {
		setChosenDateTime({
			date: tableRecord.dateTime.date,
			time: tableRecord.dateTime.time,
		});
		setDatePickerValue(
			dayjs(`${tableRecord.dateTime.date} ${tableRecord.dateTime.time}`)
		);

		setClickedEyeResponseIndex(tableRecord.gcs.eyeResponseAndIndex.index);
		setClickedVerbalResponseIndex(
			tableRecord.gcs.verbalResponseAndIndex.index
		);
		setClickedMotorResponseIndex(
			tableRecord.gcs.motorResponseAndIndex.index
		);

		setChosenEyeResponseAndIndex({
			chosenER: tableRecord.gcs.eyeResponseAndIndex.eyeResponse,
			index: tableRecord.gcs.eyeResponseAndIndex.index,
		});
		setChosenVerbalResponseAndIndex({
			chosenVR: tableRecord.gcs.verbalResponseAndIndex.verbalResponse,
			index: tableRecord.gcs.verbalResponseAndIndex.index,
		});
		setChosenMotorResponseAndIndex({
			chosenMR: tableRecord.gcs.motorResponseAndIndex.motorResponse,
			index: tableRecord.gcs.motorResponseAndIndex.index,
		});

		setTableRecordBeingEdited({
			key: tableRecord.key,
			id: tableRecord.id,
			dateTime: tableRecord.dateTime,
			gcs: tableRecord.gcs,
		});
		setTableIsBeingEdited(true);
	};

	const handleDeleteChoice = (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		tableRecord: TableColumnDefinitionType
	) => {
		confirm({
			content: (
				<p className={fileStyles.titles}>
					Molimo vas potvrdite brisanje!
				</p>
			),
			okText: "Brisanje",
			okType: "danger",
			okButtonProps: { type: "primary" },
			cancelButtonProps: { type: "default" },
			cancelText: "Odustani",
			onOk() {
				sendDeletePatientGcsRequest(
					{
						gcsId: tableRecord.id,
						physioTestId: physioTest!.id,
					},
					tableRecord
				);
			},
		});
	};

	const handleStopEditing = () => {
		resetModalStates();
	};

	const handleSavingDataBeforeExit = () => {
		dispatch(physioFileActions.setPhysioFile(physioFile));
		dispatch(physioFileActions.setGcsModalDataSaved(true));
	};

	const resetModalStates = () => {
		setChosenEyeResponseAndIndex({ chosenER: undefined, index: undefined });
		setChosenVerbalResponseAndIndex({
			chosenVR: undefined,
			index: undefined,
		});
		setChosenMotorResponseAndIndex({
			chosenMR: undefined,
			index: undefined,
		});
		setClickedEyeResponseIndex(undefined);
		setClickedVerbalResponseIndex(undefined);
		setClickedMotorResponseIndex(undefined);
		setChosenDateTime({ date: "", time: "" });
		setDatePickerValue(null);
		setTableIsBeingEdited(false);
	};

	return (
		<Modal
			centered
			className={modalStyles.modalsWidth}
			open={showModal}
			okText='Izlaz'
			closable={false}
			keyboard={false}
			maskClosable={false}
			footer={[
				<Button
					key='ok'
					disabled={tableIsBeingEdited}
					danger
					type='primary'
					className={`${modalStyles.modalsButtons} ${modalStyles.modalsExitButton}`}
					onClick={() => {
						!gcsModalDataSaved && handleSavingDataBeforeExit();
						resetModalStates();
						dispatch(modalsShowActions.setShowGcsModal(false));
					}}>
					Izlaz
				</Button>,
			]}>
			<Header className={modalStyles.modalsHeader}>
				<span>GCS - Glasgow Coma Scale</span>
			</Header>
			<Segment>
				{!physioTest && <LoadingSpinner />}
				{physioFile && physioTest && (
					<Row>
						<Col span={9}>
							<Segment isContent>
								<DatePicker
									placeholder='Odaberi datum'
									disabled={physioFile.fileClosedBy !== null}
									format={croLocale.dateFormat}
									locale={croLocale}
									value={datePickerValue}
									className={`${
										isNullOrEmpty(chosenDateTime.date)
											? modalStyles.notFilledHighlight
											: ""
									}`}
									onChange={onDatePickerChange}
								/>
								<hr style={{ width: "0px" }} />
								<ListGroup variant='flush'>
									<h3 className={fileStyles.titles}>
										Očni odgovor
									</h3>
									{gcsEyeResponses.map((er, index) => (
										<Fragment key={index}>
											<ListGroup.Item
												as={"a"}
												key={index}
												action
												aria-valuetext={er.score.toString()}
												className={
													clickedEyeResponseIndex ===
													index
														? `${modalStyles.clickedRass}`
														: `${modalStyles.rassLinks}`
												}
												onClick={(e) =>
													physioFile.fileClosedBy ===
														null &&
													handleEyeResponseClick(
														e,
														index
													)
												}>
												<span>
													{er.score}
													{" - "}
													{er.scale}
												</span>
											</ListGroup.Item>
											<hr
												style={{
													width: "0px",
													margin: "0px",
													padding: "0px",
												}}
											/>
										</Fragment>
									))}
									<hr style={{ width: "0px" }} />
									<h3 className={fileStyles.titles}>
										Verbalni odgovor
									</h3>
									{gcsVerbalResponses.map((vr, index) => (
										<Fragment key={index}>
											<ListGroup.Item
												as={"a"}
												key={index}
												action
												aria-valuetext={vr.score.toString()}
												className={
													clickedVerbalResponseIndex ===
													index
														? `${modalStyles.clickedRass}`
														: `${modalStyles.rassLinks}`
												}
												onClick={(e) =>
													physioFile.fileClosedBy ===
														null &&
													handleVerbalResponseClick(
														e,
														index
													)
												}>
												{vr.score}
												{" - "}
												{vr.scale}
											</ListGroup.Item>
											<hr
												style={{
													width: "0px",
													margin: "0px",
													padding: "0px",
												}}
											/>
										</Fragment>
									))}
									<hr style={{ width: "0px" }} />
									<h3 className={fileStyles.titles}>
										Motorički odgovor
									</h3>
									{gcsMotorResponses.map((mr, index) => (
										<Fragment key={index}>
											<ListGroup.Item
												as={"a"}
												key={index}
												action
												aria-valuetext={mr.score.toString()}
												className={
													clickedMotorResponseIndex ===
													index
														? `${modalStyles.clickedRass}`
														: `${modalStyles.rassLinks}`
												}
												onClick={(e) =>
													physioFile.fileClosedBy ===
														null &&
													handleMotorResponseClick(
														e,
														index
													)
												}>
												{mr.score}
												{" - "}
												{mr.scale}
											</ListGroup.Item>
											<hr
												style={{
													width: "0px",
													margin: "0px",
													padding: "0px",
												}}
											/>
										</Fragment>
									))}
								</ListGroup>
								<hr style={{ width: "0px" }} />
								<Row align={"middle"}>
									<Tooltip
										title='Datum, ocjena za otvaranje očiju, verbalna ocjena i motorička ocjena su obavezni parametri!'
										color='#045fbd'
										style={{
											fontFamily: "Nunito, sans-serif",
										}}>
										<InfoCircleFill
											className={modalStyles.infoIcon}
										/>
									</Tooltip>
									<Button
										type='primary'
										shape='round'
										className={modalStyles.modalsButtons}
										icon={<SaveFilled />}
										disabled={
											isNullOrEmpty(
												chosenDateTime.date
											) ||
											chosenEyeResponseAndIndex.chosenER ===
												undefined ||
											chosenVerbalResponseAndIndex.chosenVR ===
												undefined ||
											chosenMotorResponseAndIndex.chosenMR ===
												undefined
										}
										onClick={handleSaveChoice}>
										Spremi odabir
									</Button>
									{tableIsBeingEdited && (
										<Button
											type='primary'
											shape='round'
											danger
											style={{ marginLeft: "4px" }}
											className={
												modalStyles.modalsButtons
											}
											onClick={handleStopEditing}>
											Odustani
										</Button>
									)}
								</Row>
							</Segment>
						</Col>
						<Col span={15}>
							<Segment
								isContent
								className={modalStyles.tableSegment}>
								<Table
									pagination={false}
									dataSource={dataSavedToTable}
									virtual
									scroll={{ y: 400 }}
									columns={columns}
									className={modalStyles.gcsTable}
									size='small'
								/>
							</Segment>
						</Col>
					</Row>
				)}
			</Segment>
		</Modal>
	);
};

export default GcsModal;
