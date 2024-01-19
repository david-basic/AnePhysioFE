import { ChangeEvent, Fragment, useEffect, useState, type FC } from "react";
import "dayjs/locale/hr";
import dayjs, { type Dayjs } from "dayjs";
import croLocale from "antd/es/date-picker/locale/hr_HR";
import { type PhysioFileVM } from "../../../../models/physiofile/PhysioFileVM";
import { type PhysioTestVM } from "../../../../models/physiofile/physioTests/PhysioTestVM";
import { type PatientMmtVM } from "../../../../models/physiofile/physioTests/mmt/PatientMmt";
import { type MmtVM } from "../../../../models/physiofile/physioTests/mmt/MmtVm";
import { useAppDispatch } from "../../../../hooks/use_app_dispatch";
import useFetcApihWithTokenRefresh from "../../../../hooks/use_fetch_api_with_token_refresh";
import { useAppSelector } from "../../../../hooks/use_app_selector";
import { SaveFilled } from "@ant-design/icons";
import modalStyles from "../../../modals/ModalStyles.module.css";
import fileStyles from "../../PhysioFile.module.css";
import Table, { ColumnsType } from "antd/es/table";
import {
	Button,
	Col,
	DatePicker,
	DatePickerProps,
	Modal,
	Row,
	Space,
	Tooltip,
	message,
} from "antd";
import { InfoCircleFill, PencilFill, X } from "react-bootstrap-icons";
import { modalsShowActions } from "../../../../store/modals-show-slice";
import { Header } from "antd/es/layout/layout";
import Segment from "../../segments/Segment";
import LoadingSpinner from "../../../LoadingSpinner";
import isNullOrEmpty from "../../../../util/isNullOrEmpty";
import TextArea from "antd/es/input/TextArea";
import { ListGroup } from "react-bootstrap";
import generateRandomNumber from "../../../../util/generateRandomBigInteger";
import api_routes from "../../../../config/api_routes";
import { ApiResponse, NoReturnData } from "../../../../type";
import { HttpStatusCode } from "axios";
import { physioFileActions } from "../../../../store/physio-file-slice";
import confirm from "antd/es/modal/confirm";
import { type CreatePatientMmtRequestDto } from "../../../../dto/PhysioFile/PhysioTest/Mmt/CreatePatientMmtRequestDto";
import { type UpdatePatientMmtRequestDto } from "../../../../dto/PhysioFile/PhysioTest/Mmt/UpdatePatientMmtRequestDto";
import { type DeletePatientMmtRequestDto } from "../../../../dto/PhysioFile/PhysioTest/Mmt/DeletePatientMmtRequestDto";
import cutStringToNchars from "../../../../util/cutStringToXchars";

type MmtModalProps = {
	showModal: boolean;
	physioFile: PhysioFileVM;
	physioTest: PhysioTestVM | null;
	patientMmtTests: PatientMmtVM[] | null;
	mmtList: MmtVM[];
};

type MmtDateTimeType = {
	date: string;
	time: string;
};

type GradeAndDescription = {
	grade: number;
	description: string;
};

type TableColumnDefinitionType = {
	key: string;
	id: string;
	dateTime: MmtDateTimeType;
	gradeAndDescription: GradeAndDescription;
	note: string;
};

const MmtModal: FC<MmtModalProps> = ({
	showModal,
	physioFile,
	physioTest,
	patientMmtTests,
	mmtList,
}: MmtModalProps) => {
	const dispatch = useAppDispatch();
	const { fetchWithTokenRefresh } = useFetcApihWithTokenRefresh();
	const [tableIsBeingEdited, setTableIsBeingEdited] =
		useState<boolean>(false);
	const [dataSavedToTable, setDataSavedToTable] = useState<
		TableColumnDefinitionType[]
	>([]);
	const [tableRecordBeingEdited, setTableRecordBeingEdited] =
		useState<TableColumnDefinitionType>();
	const [mmtNotes, setMmtNotes] = useState<string>("");
	const [chosenMmtGrade, setChosenMmtGrade] = useState<number | undefined>(
		undefined
	);
	const [clickedMmt, setClickedMmt] = useState<number>();
	const [datePickerValue, setDatePickerValue] = useState<Dayjs | null>(null);
	const [chosenDate, setChosenDate] = useState<MmtDateTimeType>({
		date: "",
		time: "",
	});
	const dataSaved = useAppSelector(
		(state) => state.physioFileReducer.dataSaved
	);
	const dateOptions: Intl.DateTimeFormatOptions = {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		timeZone: "CET",
	};

	const columns: ColumnsType<TableColumnDefinitionType> = [
		{
			key: "mmtId",
			width: 3,
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
			width: 40,
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
			key: "gradeAndDescription",
			title: "Ocjena",
			width: 25,
			dataIndex: "gradeAndDescription",
			render: (_, { gradeAndDescription }) => (
				<Tooltip
					title={gradeAndDescription.description}
					color='#045fbd'>
					{gradeAndDescription.grade}
				</Tooltip>
			),
		},
		{
			key: "note",
			title: "Zabilješka",
			width: 150,
			dataIndex: "note",
			render: (_, { note }) => <span>{note}</span>,
		},
		{
			key: "actions",
			title: "Akcije",
			width: 40,
			render: (_, record) => (
				<Space size={"small"}>
					<Button
						type='primary'
						disabled={tableIsBeingEdited}
						onClick={(e) => handleEditChoice(e, record)}
						icon={<PencilFill className={modalStyles.icon} />}
					/>
					<Button
						type='primary'
						disabled={tableIsBeingEdited}
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
			? physioFile.physioTest.mmt.forEach((pm) => {
					const pmDateTime = dayjs(pm.mmtDateTime).format(
						"YYYY.MM.DD HH:mm:ss"
					);
					const fetchedDateTime: MmtDateTimeType = {
						date: pmDateTime.split(" ")[0],
						time: pmDateTime.split(" ")[1],
					};
					setDataSavedToTable((prevState) => {
						const newState = [...prevState];
						newState.push({
							key: generateRandomNumber(9, true)!,
							id: pm.id,
							dateTime: fetchedDateTime,
							gradeAndDescription: {
								grade: pm.grade,
								description: pm.description,
							},
							note: pm.note,
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
							message.error(
								"Nije moguće kreirati novi Physio test!"
							);
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
							dispatch(physioFileActions.setDataSaved(false));
						}
					}
			  );

		return () => {
			setDataSavedToTable([]);
		};
	}, [dispatch, fetchWithTokenRefresh, physioFile.id, physioFile.physioTest]);

	const addRecordToTable = (
		mmtGrade: number,
		chosenDateTime: MmtDateTimeType
	) => {
		setDataSavedToTable((prevState) => {
			const newState = [...prevState];
			const foundMmt = mmtList.find((mmt) => mmt.grade === mmtGrade);
			const randNum = generateRandomNumber(12)!;
			newState.push({
				key: randNum,
				id: "",
				dateTime: chosenDateTime,
				gradeAndDescription: {
					grade: foundMmt!.grade,
					description: foundMmt!.description,
				},
				note: mmtNotes,
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

	const sendAddMmtRequest = async (mmtDto: CreatePatientMmtRequestDto) => {
		try {
			fetchWithTokenRefresh(
				{
					url: api_routes.ROUTE_PHYSIO_TEST_ADD_NEW_MMT,
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: mmtDto,
				},
				(physioFileResponse: ApiResponse<PhysioFileVM>) => {
					if (physioFileResponse.status !== HttpStatusCode.Created) {
						message.error("Nije moguće spremiti novi MMT!");
						console.error(
							"There was a error while saving new MMT: ",
							physioFileResponse
						);
					} else {
						addRecordToTable(chosenMmtGrade!, chosenDate);

						dispatch(
							physioFileActions.setPhysioFile(
								physioFileResponse.data!
							)
						);
						message.success("Novi MMT uspješno spremljen!");
						dispatch(physioFileActions.setDataSaved(false));
					}
				}
			);
		} catch (error) {
			console.error("Error posting new MMT:", error);
			message.error("Neuspjelo spremanje novog MMT-a!");
		}
	};

	const sendUpdateMmtRequest = async (
		mmtToEditId: string,
		updateDto: UpdatePatientMmtRequestDto
	) => {
		try {
			fetchWithTokenRefresh(
				{
					url:
						api_routes.ROUTE_PHYSIO_TEST_UPDATE_MMT_BY_ID +
						`/${mmtToEditId}`,
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: updateDto,
				},
				(physioFileResponse: ApiResponse<PhysioFileVM>) => {
					if (physioFileResponse.status !== HttpStatusCode.Ok) {
						message.error("Nije moguće izmjeniti MMT!");
						console.error(
							"There was a error while updating MMT: ",
							physioFileResponse
						);
					} else {
						deleteRecordFromTable(tableRecordBeingEdited!);

						addRecordToTable(chosenMmtGrade!, chosenDate);

						dispatch(
							physioFileActions.setPhysioFile(
								physioFileResponse.data!
							)
						);
						message.success("VAS uspješno izmijenjen!");
						dispatch(physioFileActions.setDataSaved(false));
					}
				}
			);
		} catch (error) {
			console.error("Error updating VAS:", error);
			message.error("Neuspjela izmjena VAS-a!");
		}
	};

	const sendDeletePatientRassRequest = (
		deleteDto: DeletePatientMmtRequestDto,
		recordToDelete: TableColumnDefinitionType
	) => {
		try {
			fetchWithTokenRefresh(
				{
					url: api_routes.ROUTE_PHYSIO_TEST_DELETE_MMT,
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: deleteDto,
				},
				(deleteFileResponse: ApiResponse<NoReturnData>) => {
					if (deleteFileResponse.status !== HttpStatusCode.Ok) {
						message.error("Nije moguće izbrisati MMT!");
						console.error(
							"There was a error while deleting MMT: ",
							deleteFileResponse
						);
					} else {
						const newData = dataSavedToTable.filter(
							(item) => item.key !== recordToDelete.key
						);
						setDataSavedToTable(newData);
						dispatch(physioFileActions.setDataSaved(false));

						message.success("MMT uspješno izbrisan!");
					}
				}
			);
		} catch (error) {
			console.error("Error deleting MMT:", error);
			message.error("Neuspjelo brisanje MMT-a!");
		}
	};

	const handleMmtClick = (
		event: React.MouseEvent<Element, MouseEvent>,
		index: number
	) => {
		const clickedGrade = parseInt(event.currentTarget.ariaValueText!);

		setClickedMmt((prevClickedMmt) => {
			let newClickedMmt = prevClickedMmt;

			if (newClickedMmt === index) {
				newClickedMmt = undefined;
				setChosenMmtGrade(undefined);
			} else {
				newClickedMmt = index;
				setChosenMmtGrade(clickedGrade);
			}

			return newClickedMmt;
		});
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

	const onMmtNotesChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setMmtNotes(event.target.value);
	};

	const handleSaveChoice = () => {
		if (
			isNullOrEmpty(chosenDate.date) ||
			isNullOrEmpty(mmtNotes) ||
			chosenMmtGrade === undefined
		) {
			return;
		}

		const foundMmt = mmtList.find((mmt) => mmt.grade === chosenMmtGrade);

		if (tableIsBeingEdited) {
			const updateDto: UpdatePatientMmtRequestDto = {
				physioTestId: physioTest!.id,
				grade: foundMmt!.grade,
				description: foundMmt!.description,
				mmtDateTime: `${chosenDate.date}T${chosenDate.time}`,
				note: mmtNotes,
			};

			sendUpdateMmtRequest(tableRecordBeingEdited!.id, updateDto);
		} else {
			const createDto: CreatePatientMmtRequestDto = {
				physioTestId: physioTest!.id,
				grade: foundMmt!.grade,
				description: foundMmt!.description,
				mmtDateTime: `${chosenDate.date}T${chosenDate.time}`,
				note: mmtNotes,
			};

			sendAddMmtRequest(createDto);
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
			gradeAndDescription: tableRecord.gradeAndDescription,
			note: tableRecord.note,
		});

		setChosenDate({
			date: tableRecord.dateTime.date,
			time: tableRecord.dateTime.time,
		});
		setDatePickerValue(
			dayjs(`${tableRecord.dateTime.date} ${tableRecord.dateTime.time}`)
		);

		setClickedMmt(tableRecord.gradeAndDescription.grade);
		setChosenMmtGrade(tableRecord.gradeAndDescription.grade);
		setMmtNotes(tableRecord.note);
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
						patientMmtId: tableRecord.id,
						physioTestId: physioTest!.id,
					},
					tableRecord
				);
			},
		});
	};

	const handleSavingDataBeforeExit = () => {
		dispatch(physioFileActions.setPhysioFile(physioFile));
	};

	const resetModalStates = () => {
		setChosenDate({ date: "", time: "" });
		setClickedMmt(undefined);
		setChosenMmtGrade(undefined);
		setMmtNotes("");
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
						!dataSaved && handleSavingDataBeforeExit();
						resetModalStates();
						dispatch(modalsShowActions.setShowMmtModal(false));
					}}>
					Izlaz
				</Button>,
			]}>
			<Header className={modalStyles.modalsHeader}>
				<span>MMT - Manual Muscle Test</span>
			</Header>
			<Segment>
				{!physioTest && <LoadingSpinner />}
				{physioFile && physioTest && (
					<Row>
						<Col span={9}>
							<Segment isContent>
								<DatePicker
									placeholder='Odaberi datum'
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

								<ListGroup variant='flush'>
									{mmtList.map((mmt, index) => (
										<Fragment key={index}>
											<ListGroup.Item
												as={"a"}
												key={index}
												action
												aria-valuetext={mmt.grade.toString()}
												className={
													clickedMmt === index
														? `${modalStyles.clickedRass}`
														: `${modalStyles.rassLinks}`
												}
												onClick={(e) =>
													handleMmtClick(e, index)
												}>
												<Tooltip
													title={mmt.description}
													key={index}
													color='#045fbd'>
													{mmt.grade}{" - "}
													{cutStringToNchars(
														mmt.description,
														40
													)}
												</Tooltip>
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
								<TextArea
									id='mmtNotes'
									value={mmtNotes}
									autoSize={{ minRows: 4 }}
									onChange={onMmtNotesChange}
									placeholder='Zabilješka'
									style={{ maxWidth: "inherit" }}
									className={`${
										isNullOrEmpty(mmtNotes)
											? modalStyles.notFilledHighlight
											: ""
									} ${modalStyles.modalsTextArea}`}
								/>
								<hr style={{ width: "0px" }} />
								<Tooltip
									title='Datum, ocjena i zabilješka su obavezni parametri!'
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
										isNullOrEmpty(mmtNotes) ||
										clickedMmt === undefined
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
										className={modalStyles.modalsButtons}
										onClick={handleStopEditing}>
										Odustani
									</Button>
								)}
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
									className={modalStyles.mmtTable}
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

export default MmtModal;
