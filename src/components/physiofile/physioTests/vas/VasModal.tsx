import { ChangeEvent, useEffect, useState, type FC } from "react";

import "dayjs/locale/hr";
import dayjs, { Dayjs } from "dayjs";
import croLocale from "antd/es/date-picker/locale/hr_HR";
import {
	Button,
	Col,
	DatePicker,
	DatePickerProps,
	Modal,
	Row,
	Slider,
	SliderSingleProps,
	Space,
	Tooltip,
	message,
} from "antd";
import { FrownOutlined, SmileOutlined, SaveFilled } from "@ant-design/icons";
import modalStyles from "../../../modals/ModalStyles.module.css";
import fileStyles from "../../PhysioFile.module.css";
import { type PhysioFileVM } from "../../../../models/physiofile/PhysioFileVM";
import { type PhysioTestVM } from "../../../../models/physiofile/physioTests/PhysioTestVM";
import { type VasVM } from "../../../../models/physiofile/physioTests/VasVM";
import { useAppDispatch } from "../../../../hooks/use_app_dispatch";
import useFetcApihWithTokenRefresh from "../../../../hooks/use_fetch_api_with_token_refresh";
import { modalsShowActions } from "../../../../store/modals-show-slice";
import { useAppSelector } from "../../../../hooks/use_app_selector";
import { Header } from "antd/es/layout/layout";
import Segment from "../../segments/Segment";
import LoadingSpinner from "../../../LoadingSpinner";
import api_routes from "../../../../config/api_routes";
import { ApiResponse, NoReturnData } from "../../../../type";
import { HttpStatusCode } from "axios";
import { physioFileActions } from "../../../../store/physio-file-slice";
import Table, { ColumnsType } from "antd/es/table";
import { InfoCircleFill, PencilFill, X } from "react-bootstrap-icons";
import isNullOrEmpty from "../../../../util/isNullOrEmpty";
import generateRandomNumber from "../../../../util/generateRandomBigInteger";
import "./VasIconStyles.css";
import { CreateVasDto } from "../../../../dto/PhysioFile/PhysioTest/Vas/CreateVasDto";
import TextArea from "antd/es/input/TextArea";
import { UpdateVasDto } from "../../../../dto/PhysioFile/PhysioTest/Vas/UpdateVasDto";
import confirm from "antd/es/modal/confirm";
import { DeleteVasDto } from "../../../../dto/PhysioFile/PhysioTest/Vas/DeleteVasDto";

type VasModalProps = {
	showModal: boolean;
	physioFile: PhysioFileVM;
	physioTest: PhysioTestVM | null;
	vasTests: VasVM[] | null;
};

type VasDateTimeType = {
	date: string;
	time: string;
};

type PainLevelAndNote = {
	painLevel: number;
	note: string;
};

type TableColumnDefinitionType = {
	key: string;
	id: string;
	dateTime: VasDateTimeType;
	painLevelAndNote: PainLevelAndNote;
};

const sliderMarks: SliderSingleProps["marks"] = {
	0: "0",
	1: "1",
	2: "2",
	3: "3",
	4: "4",
	5: "5",
	6: "6",
	7: "7",
	8: "8",
	9: "9",
	10: "10",
};

const VasModal: FC<VasModalProps> = ({
	physioFile,
	physioTest,
	showModal,
	vasTests,
}: VasModalProps) => {
	const dispatch = useAppDispatch();
	const { fetchWithTokenRefresh } = useFetcApihWithTokenRefresh();
	const [tableIsBeingEdited, setTableIsBeingEdited] =
		useState<boolean>(false);
	const [dataSavedToTable, setDataSavedToTable] = useState<
		TableColumnDefinitionType[]
	>([]);
	const [tableRecordBeingEdited, setTableRecordBeingEdited] =
		useState<TableColumnDefinitionType>();
	const [vasNotes, setVasNotes] = useState<string>("");
	const [painLevelSliderValue, setPainLevelSliderValue] = useState<number>(0);
	const mid = 6;
	const prevHighlightCls =
		painLevelSliderValue >= mid ? "" : "icon-wrapper-active";
	const nextHighlightCls =
		painLevelSliderValue >= mid ? "icon-wrapper-active" : "";
	const [datePickerValue, setDatePickerValue] = useState<Dayjs | null>(null);
	const [chosenDate, setChosenDate] = useState<VasDateTimeType>({
		date: "",
		time: "",
	});
	const vasModalDataSaved = useAppSelector(
		(state) => state.physioFileReducer.vasModalDataSaved
	);
	const dateOptions: Intl.DateTimeFormatOptions = {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		timeZone: "CET",
	};

	const columns: ColumnsType<TableColumnDefinitionType> = [
		{
			key: "vasId",
			width: 1,
			dataIndex: "id",
			render: (_, { id }) => (
				<div style={{ visibility: "hidden", width: 0, height: 0 }}>
					{id}
				</div>
			),
		},
		{
			key: "date",
			title: "Datum",
			dataIndex: "dateTime",
			width: 45,
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
			key: "pain",
			title: "Razina boli",
			width: 40,
			dataIndex: "painLevelAndNote",
			render: (_, { painLevelAndNote }) => (
				<span>{painLevelAndNote.painLevel}/10</span>
			),
		},
		{
			key: "notes",
			title: "Zabilješke",
			width: 120,
			dataIndex: "painLevelAndNote",
			render: (_, { painLevelAndNote }) => (
				<span>{painLevelAndNote.note}</span>
			),
		},
		{
			key: "actions",
			title: "Akcije",
			width: 48,
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

	useEffect(() => {
		physioFile.physioTest !== null
			? physioFile.physioTest.vas.forEach((vt) => {
					const vtDateTime = dayjs(vt.vasDateTime).format(
						"YYYY-MM-DD HH:mm:ss"
					);

					const fetchedDateTime: VasDateTimeType = {
						date: vtDateTime.split(" ")[0],
						time: vtDateTime.split(" ")[1],
					};

					setDataSavedToTable((prevState) => {
						const newState = [...prevState];
						newState.push({
							key: generateRandomNumber(9, true)!,
							id: vt.id,
							dateTime: fetchedDateTime,
							painLevelAndNote: {
								painLevel: vt.painLevel,
								note: vt.note,
							},
						});

						return newState;
					});
			  })
			: fetchWithTokenRefresh(
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
							message.error(physioFileResponse.message);
							console.error(
								"There was a error creating physio test: ",
								physioFileResponse
							);
						} else {
							dispatch(
								physioFileActions.setCurrentPhysioFile(
									physioFileResponse.data!
								)
							);
							dispatch(
								physioFileActions.setVasModalDataSaved(false)
							);
						}
					}
			  );

		return () => {
			setDataSavedToTable([]);
		};
	}, [dispatch, fetchWithTokenRefresh, physioFile, physioFile.id, vasTests]);

	const addRecordToTable = (
		sliderValue: number,
		chosenDateTime: VasDateTimeType
	) => {
		setDataSavedToTable((prevState) => {
			const newState = [...prevState];
			const randNum = generateRandomNumber(12)!;
			newState.push({
				key: randNum,
				id: "",
				dateTime: chosenDateTime,
				painLevelAndNote: {
					painLevel: sliderValue,
					note: vasNotes,
				},
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

	const sendAddVasRequest = async (vasDto: CreateVasDto) => {
		try {
			fetchWithTokenRefresh(
				{
					url: api_routes.ROUTE_PHYSIO_TEST_ADD_NEW_VAS,
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: vasDto,
				},
				(physioFileResponse: ApiResponse<PhysioFileVM>) => {
					if (physioFileResponse.status !== HttpStatusCode.Created) {
						message.error("Nije moguće spremiti novi VAS!");
						message.error(physioFileResponse.message);
						console.error(
							"There was a error while saving new VAS: ",
							physioFileResponse
						);
					} else {
						addRecordToTable(painLevelSliderValue, chosenDate);

						dispatch(
							physioFileActions.setCurrentPhysioFile(
								physioFileResponse.data!
							)
						);
						message.success("Novi VAS uspješno spremljen!");
						dispatch(physioFileActions.setVasModalDataSaved(false));
					}
				}
			);
		} catch (error) {
			console.error("Error posting new VAS:", error);
			message.error("Neuspjelo spremanje novog VAS-a!");
		}
	};

	const sendUpdateVasRequest = async (
		vasToEditId: string,
		updateDto: UpdateVasDto
	) => {
		try {
			fetchWithTokenRefresh(
				{
					url:
						api_routes.ROUTE_PHYSIO_TEST_UPDATE_VAS_BY_ID +
						`/${vasToEditId}`,
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: updateDto,
				},
				(physioFileResponse: ApiResponse<PhysioFileVM>) => {
					if (physioFileResponse.status !== HttpStatusCode.Ok) {
						message.error("Nije moguće izmjeniti VAS!");
						message.error(physioFileResponse.message);
						console.error(
							"There was a error while updating VAS: ",
							physioFileResponse
						);
					} else {
						deleteRecordFromTable(tableRecordBeingEdited!);

						addRecordToTable(painLevelSliderValue, chosenDate);

						dispatch(
							physioFileActions.setCurrentPhysioFile(
								physioFileResponse.data!
							)
						);
						message.success("VAS uspješno izmijenjen!");
						dispatch(physioFileActions.setVasModalDataSaved(false));
					}
				}
			);
		} catch (error) {
			console.error("Error updating VAS:", error);
			message.error("Neuspjela izmjena VAS-a!");
		}
	};

	const sendDeletePatientRassRequest = async (
		deleteDto: DeleteVasDto,
		recordToDelete: TableColumnDefinitionType
	) => {
		try {
			fetchWithTokenRefresh(
				{
					url: api_routes.ROUTE_PHYSIO_TEST_DELETE_VAS,
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: deleteDto,
				},
				(deleteFileResponse: ApiResponse<NoReturnData>) => {
					if (deleteFileResponse.status !== HttpStatusCode.Ok) {
						message.error("Nije moguće izbrisati VAS!");
						message.error(deleteFileResponse.message);
						console.error(
							"There was a error while deleting VAS: ",
							deleteFileResponse
						);
					} else {
						const newData = dataSavedToTable.filter(
							(item) => item.key !== recordToDelete.key
						);
						setDataSavedToTable(newData);
						dispatch(physioFileActions.setVasModalDataSaved(false));

						message.success("VAS uspješno izbrisan!");
					}
				}
			);
		} catch (error) {
			console.error("Error deleting VAS:", error);
			message.error("Neuspjelo brisanje VAS-a!");
		}
	};

	const onDatePickerChange: DatePickerProps["onChange"] = (
		date,
		dateString
	) => {
		if (isNullOrEmpty(dateString)) {
			setChosenDate({ date: "", time: "" });
			setDatePickerValue(null);
			return;
		}

		const currentTime = dayjs().format("HH:mm:ss");

		setDatePickerValue(date);
		setChosenDate({ date: dateString, time: currentTime });
	};

	const onVasNotesChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setVasNotes(event.target.value);
	};

	const handleSaveChoice = () => {
		if (isNullOrEmpty(chosenDate.date) || isNullOrEmpty(vasNotes)) {
			return;
		}

		if (tableIsBeingEdited) {
			const updateDto: UpdateVasDto = {
				physioTestId: physioTest!.id,
				painLevel: painLevelSliderValue,
				vasDateTime: `${chosenDate.date}T${chosenDate.time}`,
				note: vasNotes,
			};

			sendUpdateVasRequest(tableRecordBeingEdited!.id, updateDto);
		} else {
			const createDto: CreateVasDto = {
				physioTestId: physioTest!.id,
				painLevel: painLevelSliderValue,
				vasDateTime: `${chosenDate.date}T${chosenDate.time}`,
				note: vasNotes,
			};

			sendAddVasRequest(createDto);
		}

		resetModalStates();
	};

	const handleEditChoice = (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		tableRecord: TableColumnDefinitionType
	) => {
		setTableIsBeingEdited(true);

		setTableRecordBeingEdited({
			key: tableRecord.key,
			id: tableRecord.id,
			dateTime: tableRecord.dateTime,
			painLevelAndNote: tableRecord.painLevelAndNote,
		});

		setChosenDate({
			date: tableRecord.dateTime.date,
			time: tableRecord.dateTime.time,
		});
		setDatePickerValue(
			dayjs(`${tableRecord.dateTime.date} ${tableRecord.dateTime.time}`)
		);

		setPainLevelSliderValue(tableRecord.painLevelAndNote.painLevel);
		setVasNotes(tableRecord.painLevelAndNote.note);
	};

	const handleStopEditing = () => {
		resetModalStates();
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
				sendDeletePatientRassRequest(
					{
						vasId: tableRecord.id,
						physioTestId: physioTest!.id,
					},
					tableRecord
				);
			},
		});
	};

	const handleSavingDataBeforeExit = () => {
		dispatch(physioFileActions.setCurrentPhysioFile(physioFile));
		dispatch(physioFileActions.setVasModalDataSaved(true));
	};

	const resetModalStates = () => {
		setChosenDate({ date: "", time: "" });
		setPainLevelSliderValue(0);
		setVasNotes("");
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
						!vasModalDataSaved && handleSavingDataBeforeExit();
						resetModalStates();
						dispatch(modalsShowActions.setShowVasModal(false));
					}}>
					Izlaz
				</Button>,
			]}>
			<Header className={modalStyles.modalsHeader}>
				<span>VAS - Visual Analogue Scale</span>
			</Header>
			<Segment>
				{!physioTest && <LoadingSpinner />}
				{physioFile && physioTest && (
					<Row>
						<Col span={12}>
							<Segment isContent>
								<DatePicker
									placeholder='Odaberi datum'
									disabled={physioFile.fileClosedBy !== null}
									format={croLocale.dateFormat}
									locale={croLocale}
									value={datePickerValue}
									className={`${
										isNullOrEmpty(chosenDate.date)
											? modalStyles.notFilledHighlight
											: ""
									}`}
									onChange={onDatePickerChange}
								/>
								<hr style={{ width: "0px" }} />
								<div className='icon-wrapper'>
									<SmileOutlined
										className={prevHighlightCls}
									/>
									<Slider
										min={0}
										max={10}
										marks={sliderMarks}
										step={null}
										value={painLevelSliderValue}
										disabled={
											physioFile.fileClosedBy !== null
										}
										onChange={setPainLevelSliderValue}
										styles={{
											track: {
												background: "transparent",
											},
											rail: {
												background: `linear-gradient(to right, #00ff00, #ff0000)`,
											},
										}}
									/>
									<FrownOutlined
										className={nextHighlightCls}
									/>
								</div>
								<hr style={{ width: "0px" }} />
								<TextArea
									id='vasNotes'
									disabled={physioFile.fileClosedBy !== null}
									value={vasNotes}
									autoSize={{ minRows: 4 }}
									onChange={onVasNotesChange}
									placeholder='Zabilješka'
									style={{ maxWidth: "inherit" }}
									className={`${
										isNullOrEmpty(vasNotes)
											? modalStyles.notFilledHighlight
											: ""
									} ${modalStyles.modalsTextArea}`}
								/>
								<hr style={{ width: "0px" }} />
								<Row align={"middle"}>
									<Tooltip
										title='Datum, razina boli i zabilješka su obavezni parametri!'
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
											isNullOrEmpty(chosenDate.date) ||
											isNullOrEmpty(vasNotes)
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
						<Col span={12}>
							<Segment
								isContent
								className={modalStyles.tableSegment}>
								<Table
									pagination={false}
									dataSource={dataSavedToTable}
									virtual
									scroll={{ y: 400 }}
									columns={columns}
									className={modalStyles.vasTable}
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

export default VasModal;
