import { ChangeEvent, Fragment, useEffect, useState, type FC } from "react";
import { type PatientRassVM } from "../../../models/physiofile/assessment/PatientRassVM";
import { useAppDispatch } from "../../../hooks/use_app_dispatch";
import { modalsShowActions } from "../../../store/modals-show-slice";
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
import modalStyles from "../../modals/ModalStyles.module.css";
import fileStyles from "../PhysioFile.module.css";
import { SaveFilled } from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import Segment from "../segments/Segment";
import { physioFileActions } from "../../../store/physio-file-slice";
import croLocale from "antd/es/date-picker/locale/hr_HR";
import "dayjs/locale/hr";
import dayjs, { Dayjs } from "dayjs";
import { ListGroup } from "react-bootstrap";
import LoadingSpinner from "../../LoadingSpinner";
import { type RassVM } from "../../../models/physiofile/assessment/RassVM";
import isNullOrEmpty from "../../../util/isNullOrEmpty";
import TextArea from "antd/es/input/TextArea";
import Table, { ColumnsType } from "antd/es/table";
import { InfoCircleFill, PencilFill, X } from "react-bootstrap-icons";
import confirm from "antd/es/modal/confirm";
import generateRandomNumber from "../../../util/generateRandomBigInteger";
import useFetcApihWithTokenRefresh from "../../../hooks/use_fetch_api_with_token_refresh";
import { type ApiResponse, type NoReturnData } from "../../../type";
import { PhysioFileVM } from "../../../models/physiofile/PhysioFileVM";
import api_routes from "../../../config/api_routes";
import { CreatePatientRassDTO } from "../../../dto/PhysioFile/Assessment/CreatePatientRassDTO";
import { useAppSelector } from "../../../hooks/use_app_selector";
import { HttpStatusCode } from "axios";
import { type AssessmentVM } from "../../../models/physiofile/assessment/AssessmentVM";
import { type DeletePatientRassRequestDto } from "../../../dto/PhysioFile/Assessment/DeletePatientRassRequestDto";
import { type UpdatePatientRassRequestDto } from "../../../dto/PhysioFile/Assessment/UpdatePatientRassRequestDto";

type RassModalProps = {
	showModal: boolean;
	patientRassTests: PatientRassVM[] | null;
	assessment: AssessmentVM | null;
	rassList: RassVM[];
};

type RassDateType = {
	date: string;
	time: string;
};

type ScoreTermNoteAndIndex = {
	scoreAndTerm: string;
	scoreDescription: string;
	additionalNotes: string;
	index: number;
};

type TableColumnDefinitionType = {
	key: string;
	id: string;
	dateTime: RassDateType;
	scoreAndNoteAndIndex: ScoreTermNoteAndIndex;
};

type RassChosenScoreAndIndex = {
	chosenScore: string;
	chosenScoreIndex: number | undefined;
};

const RassModal: FC<RassModalProps> = ({
	showModal,
	patientRassTests,
	assessment,
	rassList,
}: RassModalProps) => {
	const dispatch = useAppDispatch();
	const { fetchWithTokenRefresh } = useFetcApihWithTokenRefresh();
	const [clickedIndex, setClickedIndex] = useState<number>();
	const [chosenDate, setChosenDate] = useState<RassDateType>({
		date: "",
		time: "",
	});
	const [chosenRassScoreAndIndex, setChosenRassScoreAndIndex] =
		useState<RassChosenScoreAndIndex>({
			chosenScore: "",
			chosenScoreIndex: undefined,
		});
	const [tableIsBeingEdited, setTableIsBeingEdited] =
		useState<boolean>(false);
	const [additionalNotes, setAdditionalNotes] = useState<string>("");
	const [tableRecordBeingEdited, setTableRecordBeingEdited] =
		useState<TableColumnDefinitionType>();
	const [datePickerValue, setDatePickerValue] = useState<Dayjs | null>(null);
	const [dataSavedToTable, setDataSavedToTable] = useState<
		TableColumnDefinitionType[]
	>([]);
	const physioFile = useAppSelector(
		(state) => state.physioFileReducer.currentPhysioFile
	);
	const rassModalDataSaved = useAppSelector(
		(state) => state.physioFileReducer.rassModalDataSaved
	);
	const dateOptions: Intl.DateTimeFormatOptions = {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		timeZone: "CET",
	};

	useEffect(() => {
		patientRassTests &&
			patientRassTests.forEach((pr) => {
				const prDateTime = dayjs(pr.rassDateTime).format(
					"YYYY-MM-DD HH:mm:ss"
				);

				const dateTimeToBeStoredToTable: RassDateType = {
					date: prDateTime.split(" ")[0],
					time: prDateTime.split(" ")[1],
				};

				const rass: RassChosenScoreAndIndex = {
					chosenScore: pr.score,
					chosenScoreIndex: rassList.findIndex(
						(r) => r.score === pr.score
					),
				};

				setDataSavedToTable((prevState) => {
					const newState = [...prevState];
					const foundRass = rassList.find(
						(r) => r.score === rass.chosenScore
					);
					newState.push({
						key: generateRandomNumber(9, true)!,
						id: pr.id,
						dateTime: dateTimeToBeStoredToTable,
						scoreAndNoteAndIndex: {
							additionalNotes: pr.additionalDescription,
							scoreAndTerm: `${foundRass?.score}: ${foundRass?.term}`,
							scoreDescription: pr.scoreDescription,
							index: rass.chosenScoreIndex!,
						},
					});

					return newState;
				});
			});

		return () => {
			setDataSavedToTable([]);
		};
	}, [
		dispatch,
		fetchWithTokenRefresh,
		patientRassTests,
		physioFile.id,
		rassList,
	]);

	const columns: ColumnsType<TableColumnDefinitionType> = [
		{
			key: "rassIndex",
			width: 1,
			dataIndex: "index",
			render: (_, { scoreAndNoteAndIndex }) => (
				<div style={{ visibility: "hidden", width: 0, height: 0 }}>
					{scoreAndNoteAndIndex.index}
				</div>
			),
		},
		{
			key: "rassId",
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
			width: 35,
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
			key: "scoreAndTerm",
			title: "Ocjena",
			width: 20,
			dataIndex: "scoreAndNoteAndIndex",
			render: (_, { scoreAndNoteAndIndex }) => (
				<Tooltip
					title={`${
						scoreAndNoteAndIndex.scoreAndTerm.split(": ")[1]
					} - ${scoreAndNoteAndIndex.scoreDescription}`}
					color='#045fbd'>
					{scoreAndNoteAndIndex.scoreAndTerm.split(": ")[0]}
				</Tooltip>
			),
		},
		{
			key: "additionalNote",
			title: "Zabilješka",
			width: 130,
			dataIndex: "scoreAndNoteAndIndex",
			render: (_, { scoreAndNoteAndIndex }) => (
				<span>{scoreAndNoteAndIndex.additionalNotes}</span>
			),
		},
		{
			key: "actions",
			title: "Akcije",
			width: 40,
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

	const handleRassClick = (
		event: React.MouseEvent<Element, MouseEvent>,
		index: number
	) => {
		setNewClickedRass(index, event.currentTarget.ariaValueText!);
	};

	const sendUpdatePatientRassRequest = async (
		patientRassId: string,
		updateDto: UpdatePatientRassRequestDto
	) => {
		try {
			fetchWithTokenRefresh(
				{
					url:
						api_routes.ROUTE_ASSESSMENT_UPDATE_PATIENT_RASS_BY_ID +
						`/${patientRassId}`,
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: updateDto,
				},
				(physioFileResponse: ApiResponse<PhysioFileVM>) => {
					if (physioFileResponse.status !== HttpStatusCode.Ok) {
						message.error("Nije moguće izmjeniti RASS!");
						message.error(physioFileResponse.message);
						console.error(
							"There was a error while updating patient RASS: ",
							physioFileResponse
						);
					} else {
						deleteRecordFromTable(tableRecordBeingEdited!);

						addRecordToTable(chosenRassScoreAndIndex, chosenDate);

						dispatch(
							physioFileActions.setCurrentPhysioFile(
								physioFileResponse.data!
							)
						);
						message.success("RASS uspješno izmijenjen!");
						dispatch(
							physioFileActions.setRassModalDataSaved(false)
						);
					}
				}
			);
		} catch (error) {
			console.error("Error updating Patient RASS:", error);
			message.error("Neuspjela izmjena RASS-a!");
		}
	};

	const sendAddPatientRassRequest = async (
		prDTO: CreatePatientRassDTO,
		chosenRecord: RassChosenScoreAndIndex
	) => {
		try {
			fetchWithTokenRefresh(
				{
					url: api_routes.ROUTE_ASSESSMENT_ADD_NEW_PATIENT_RASS,
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: prDTO,
				},
				(physioFileResponse: ApiResponse<PhysioFileVM>) => {
					if (physioFileResponse.status !== HttpStatusCode.Ok) {
						message.error("Nije moguće spremiti novi RASS!");
						message.error(physioFileResponse.message);
						console.error(
							"There was a error while saving new patient RASS: ",
							physioFileResponse
						);
					} else {
						addRecordToTable(chosenRecord, chosenDate);

						dispatch(
							physioFileActions.setCurrentPhysioFile(
								physioFileResponse.data!
							)
						);
						message.success("Novi RASS uspješno spremljen!");
						dispatch(
							physioFileActions.setRassModalDataSaved(false)
						);
					}
				}
			);
		} catch (error) {
			console.error("Error posting new Patient RASS:", error);
			message.error("Neuspjelo spremanje novog RASS-a!");
		}
	};

	const handleSaveChoice = () => {
		if (
			isNullOrEmpty(chosenDate.date) ||
			isNullOrEmpty(chosenRassScoreAndIndex.chosenScore)
		) {
			return;
		}

		const foundRass = rassList.find(
			(r) => r.score === chosenRassScoreAndIndex.chosenScore
		);

		if (tableIsBeingEdited) {
			const updateDto: UpdatePatientRassRequestDto = {
				assessmentId: assessment!.id,
				score: foundRass!.score,
				term: foundRass!.term,
				scoreDescription: foundRass!.scoreDescription,
				rassDateTime: dayjs(
					`${chosenDate.date} ${chosenDate.time}`
				).format("YYYY-MM-DDTHH:mm:ss"),
				additionalDescription: additionalNotes,
			};

			sendUpdatePatientRassRequest(tableRecordBeingEdited!.id, updateDto);
		} else {
			const prDTO: CreatePatientRassDTO = {
				assessmentId: assessment!.id,
				score: foundRass!.score,
				term: foundRass!.term,
				scoreDescription: foundRass!.scoreDescription,
				rassDateTime: dayjs(
					`${chosenDate.date} ${chosenDate.time}`
				).format("YYYY-MM-DDTHH:mm:ss"),
				additionalDescription: additionalNotes,
			};

			sendAddPatientRassRequest(prDTO, chosenRassScoreAndIndex);
		}

		resetModalStates();
	};

	const deleteRecordFromTable = (
		recordToDelete: TableColumnDefinitionType
	) => {
		const newData = dataSavedToTable.filter(
			(item) => item.key !== recordToDelete.key
		);
		setDataSavedToTable(newData);
	};

	const addRecordToTable = (
		rass: RassChosenScoreAndIndex,
		chosenDateTime: RassDateType
	) => {
		setDataSavedToTable((prevState) => {
			const newState = [...prevState];
			const foundRass = rassList.find(
				(r) => r.score === rass.chosenScore
			);
			const randNum = generateRandomNumber(12)!;
			newState.push({
				key: randNum,
				id: "",
				dateTime: chosenDateTime,
				scoreAndNoteAndIndex: {
					additionalNotes: additionalNotes,
					scoreAndTerm: `${foundRass?.score}: ${foundRass?.term}`,
					scoreDescription: foundRass!.scoreDescription,
					index: rass.chosenScoreIndex!,
				},
			});

			return newState;
		});
	};

	const setNewClickedRass = (index: number, score: string) => {
		setClickedIndex((prevClickedIndex) => {
			let newClickedIndex = prevClickedIndex;

			if (newClickedIndex === index) {
				newClickedIndex = undefined;
				setChosenRassScoreAndIndex({
					chosenScore: "",
					chosenScoreIndex: undefined,
				});
			} else {
				newClickedIndex = index;
				setChosenRassScoreAndIndex({
					chosenScore: score,
					chosenScoreIndex: index,
				});
			}

			return newClickedIndex;
		});
	};

	const handleAdditionalNotesChange = (
		event: ChangeEvent<HTMLTextAreaElement>
	) => {
		setAdditionalNotes(event.target.value);
	};

	const sendDeletePatientRassRequest = async (
		deleteDto: DeletePatientRassRequestDto,
		recordToDelete: TableColumnDefinitionType
	) => {
		try {
			fetchWithTokenRefresh(
				{
					url: api_routes.ROUTE_ASSESSMENT_DELETE_PATIENT_RASS,
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: deleteDto,
				},
				(deleteFileResponse: ApiResponse<NoReturnData>) => {
					if (deleteFileResponse.status !== HttpStatusCode.Ok) {
						message.error("Nije moguće izbrisati RASS!");
						message.error(deleteFileResponse.message);
						console.error(
							"There was a error while deleting patient RASS: ",
							deleteFileResponse
						);
					} else {
						const newData = dataSavedToTable.filter(
							(item) => item.key !== recordToDelete.key
						);
						setDataSavedToTable(newData);
						dispatch(
							physioFileActions.setRassModalDataSaved(false)
						);

						message.success("RASS uspješno izbrisan!");
					}
				}
			);
		} catch (error) {
			console.error("Error deleting RASS:", error);
			message.error("Neuspjelo brisanje RASS-a!");
		}
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
						patientRassId: tableRecord.id,
						assessmentId: assessment!.id,
					},
					tableRecord
				);
			},
		});
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
			scoreAndNoteAndIndex: tableRecord.scoreAndNoteAndIndex,
		});

		setChosenDate({
			date: tableRecord.dateTime.date,
			time: tableRecord.dateTime.time,
		});
		setDatePickerValue(
			dayjs(`${tableRecord.dateTime.date} ${tableRecord.dateTime.time}`)
		);
		setAdditionalNotes(tableRecord.scoreAndNoteAndIndex.additionalNotes);
		setClickedIndex(tableRecord.scoreAndNoteAndIndex.index);
		setChosenRassScoreAndIndex({
			chosenScore:
				tableRecord.scoreAndNoteAndIndex.scoreAndTerm.split(":")[0],
			chosenScoreIndex: tableRecord.scoreAndNoteAndIndex.index,
		});
	};

	const handleStopEditing = () => {
		resetModalStates();
	};

	const handleSavingDataBeforeExit = () => {
		dispatch(physioFileActions.setCurrentPhysioFile(physioFile));
		dispatch(physioFileActions.setRassModalDataSaved(true));
	};

	const resetModalStates = () => {
		setChosenDate({ date: "", time: "" });
		setChosenRassScoreAndIndex({
			chosenScore: "",
			chosenScoreIndex: undefined,
		});
		setClickedIndex(undefined);
		setAdditionalNotes("");
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
						!rassModalDataSaved && handleSavingDataBeforeExit();
						resetModalStates();
						dispatch(modalsShowActions.setShowRassModal(false));
					}}>
					Izlaz
				</Button>,
			]}>
			<Header className={modalStyles.modalsHeader}>
				<span>RASS - Richmond Agitation-Sedation Scale</span>
			</Header>
			<Segment>
				{(!assessment || !rassList) && <LoadingSpinner />}
				{assessment && rassList && (
					<Row>
						<Col span={10}>
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
								<ListGroup variant='flush'>
									{rassList.map((r, index) => (
										<Fragment key={index}>
											<ListGroup.Item
												as={"a"}
												key={index}
												action
												aria-valuetext={r.score}
												className={
													clickedIndex === index
														? `${modalStyles.clickedRass}`
														: `${modalStyles.rassLinks}`
												}
												onClick={(e) =>
													physioFile.fileClosedBy ===
														null &&
													handleRassClick(e, index)
												}>
												<Tooltip
													title={r.scoreDescription}
													key={index}
													color='#045fbd'>
													{r.score}: {r.term}
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
									id='rassAdditionalNotes'
									disabled={physioFile.fileClosedBy !== null}
									value={additionalNotes}
									autoSize={{ minRows: 4 }}
									onChange={handleAdditionalNotesChange}
									placeholder='Dodatne zabilješke'
									style={{ maxWidth: "inherit" }}
									className={modalStyles.modalsTextArea}
								/>
								<hr style={{ width: "0px" }} />
								<Row align={"middle"}>
									<Tooltip
										title='Datum i ocjena su obavezni parametri!'
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
											isNullOrEmpty(
												chosenRassScoreAndIndex.chosenScore
											)
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
						<Col span={14}>
							<Segment
								isContent
								className={modalStyles.tableSegment}>
								<Table
									pagination={false}
									dataSource={dataSavedToTable}
									virtual
									scroll={{ y: 400 }}
									columns={columns}
									className={modalStyles.rassTable}
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

export default RassModal;
