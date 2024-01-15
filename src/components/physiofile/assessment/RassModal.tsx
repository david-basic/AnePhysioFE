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
import { PencilFill, X } from "react-bootstrap-icons";
import confirm from "antd/es/modal/confirm";
import generateRandomNumber from "../../../util/generateRandomBigInteger";
import useFetcApihWithTokenRefresh from "../../../hooks/use_fetch_api_with_token_refresh";
import { ApiResponse } from "../../../type";
import { PhysioFileVM } from "../../../models/physiofile/PhysioFileVM";
import api_routes from "../../../config/api_routes";
import { CreatePatientRassDTO } from "../../../dto/PhysioFile/Assessment/CreatePatientRassDTO";
import { useAppSelector } from "../../../hooks/use_app_selector";
import { HttpStatusCode } from "axios";
import { AssessmentVM } from "../../../models/physiofile/assessment/AssessmentVM";

type RassModalProps = {
	showModal: boolean;
	patientRassTests: PatientRassVM[];
	assessment: AssessmentVM;
	rassList: RassVM[];
};

type RassDateType = {
	date: string;
	time: string;
};

type ScoreAndNoteAndIndex = {
	scoreAndTerm: string;
	additionalNotes: string;
	index: number;
};

type RassTableType = {
	key: string;
	id: string;
	dateTime: RassDateType;
	scoreAndNoteAndIndex: ScoreAndNoteAndIndex;
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
		useState<RassTableType>();
	const [datePickerValue, setDatePickerValue] = useState<Dayjs | null>(null);
	const [dataSavedToTable, setDataSavedToTable] = useState<RassTableType[]>(
		[]
	);
	const physioFile = useAppSelector(
		(state) => state.physioFileReducer.physioFile
	);
	const dateOptions: Intl.DateTimeFormatOptions = {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		timeZone: "CET",
	};

	// sessionStorage.setItem("rassModalLoaded", "false");

	useEffect(() => {
		//TODO this might input 2 or 3 of the same since when i save the patient Rass, the
		//tests state will update and this will run again

		// if (sessionStorage.getItem("rassModalLoaded") !== "true") {

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
						index: rass.chosenScoreIndex!,
					},
				});

				return newState;
			});
		});
		// }

		return () => {
			// sessionStorage.setItem("rassModalLoaded", "true");
			setDataSavedToTable([]);
		};
	}, [patientRassTests, rassList]);

	const columns: ColumnsType<RassTableType> = [
		{
			key: "rassIndex",
			width: 3,
			dataIndex: "index",
			render: (_, { scoreAndNoteAndIndex }) => (
				<div style={{ visibility: "hidden", width: 0, height: 0 }}>
					{scoreAndNoteAndIndex.index}
				</div>
			),
		},
		{
			key: "rassId",
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
			width: 90,
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
			width: 150,
			dataIndex: "scoreAndNoteAndIndex",
			render: (_, { scoreAndNoteAndIndex }) => (
				<Tooltip
					title={scoreAndNoteAndIndex.additionalNotes}
					color='#045fbd'>
					{scoreAndNoteAndIndex.scoreAndTerm}
				</Tooltip>
			),
		},
		{
			key: "actions",
			title: "Akcije",
			width: 90,
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

	const onDatePickerChange: DatePickerProps["onChange"] = (
		date,
		dateString
	) => {
		if (isNullOrEmpty(dateString)) {
			setChosenDate({ date: "", time: "" });
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

	const sendAddPatientRassRequest = async (prDTO: CreatePatientRassDTO) => {
		try {
			fetchWithTokenRefresh(
				{
					url: api_routes.ROUTE_PHYSIO_FILE_ADD_NEW_PATIENT_RASS,
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: prDTO,
				},
				(physioFileResponse: ApiResponse<PhysioFileVM>) => {
					if (physioFileResponse.status !== HttpStatusCode.Ok) {
						message.error("Nije moguće spremiti novi RASS!");
						console.error(
							"There was a error while saving new patient RASS: ",
							physioFileResponse
						);
					} else {
						dispatch(
							physioFileActions.setPhysioFile(
								physioFileResponse.data!
							)
						);
						message.success("Novi RASS uspješno spremljen!");
						console.log("physioFileResponse: ", physioFileResponse);
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

		if (tableIsBeingEdited) {
			deleteRecordFromTable(tableRecordBeingEdited!);

			addRecordToTable(chosenRassScoreAndIndex);

			setTableIsBeingEdited(false);
		} else {
			addRecordToTable(chosenRassScoreAndIndex);

			const foundRass = rassList.find(
				(r) => r.score === chosenRassScoreAndIndex.chosenScore
			);
			const prDTO: CreatePatientRassDTO = {
				assessmentId: assessment.id,
				score: foundRass!.score,
				term: foundRass!.term,
				scoreDescription: foundRass!.scoreDescription,
				rassDateTime: `${chosenDate.date}T${chosenDate.time}`,
				additionalDescription: additionalNotes,
			};

			sendAddPatientRassRequest(prDTO);
		}

		setChosenDate({ date: "", time: "" });
		setChosenRassScoreAndIndex({
			chosenScore: "",
			chosenScoreIndex: undefined,
		});
		setClickedIndex(undefined);
		setAdditionalNotes("");
		setDatePickerValue(null);
		dispatch(physioFileActions.setDataSaved(false));
	};

	const deleteRecordFromTable = (recordToDelete: RassTableType) => {
		const newData = dataSavedToTable.filter(
			(item) => item.key !== recordToDelete.key
		);
		setDataSavedToTable(newData);

		//TODO make delete call to API here!
	};

	const addRecordToTable = (rass: RassChosenScoreAndIndex) => {
		setDataSavedToTable((prevState) => {
			const newState = [...prevState];
			const foundRass = rassList.find(
				(r) => r.score === rass.chosenScore
			);
			const randNum = generateRandomNumber(12)!;
			newState.push({
				key: randNum,
				id: "",
				dateTime: chosenDate,
				scoreAndNoteAndIndex: {
					additionalNotes: additionalNotes,
					scoreAndTerm: `${foundRass?.score}: ${foundRass?.term}`,
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
		dispatch(physioFileActions.setDataSaved(false));
	};

	const handleDeleteChoice = (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		tableRecord: RassTableType
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
				const newData = dataSavedToTable.filter(
					(item) => item.key !== tableRecord.key
				);
				setDataSavedToTable(newData);
				dispatch(physioFileActions.setDataSaved(false));
			},
		});
	};

	const handleEditChoice = (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		tableRecord: RassTableType
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
		dispatch(physioFileActions.setDataSaved(false));
	};

	const handleStopEditing = () => {
		setChosenDate({ date: "", time: "" });
		setChosenRassScoreAndIndex({
			chosenScore: "",
			chosenScoreIndex: undefined,
		});
		setClickedIndex(undefined);
		setAdditionalNotes("");
		setDatePickerValue(null);
		setTableIsBeingEdited(false);
		dispatch(physioFileActions.setDataSaved(false));
	};

	const handleSavingDataBeforeExit = () => {
		//TODO handle saving to global state here !!!
		dispatch(physioFileActions.setPhysioFile(physioFile));
	};

	return (
		<Modal
			centered
			className={modalStyles.rassModal}
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
					className={`${modalStyles.modalsButtons} ${modalStyles.rassExitButton}`}
					onClick={() => {
						handleSavingDataBeforeExit();

						setChosenDate({ date: "", time: "" });
						setChosenRassScoreAndIndex({
							chosenScore: "",
							chosenScoreIndex: undefined,
						});
						setClickedIndex(undefined);
						setAdditionalNotes("");
						setDatePickerValue(null);
						setTableIsBeingEdited(false);
						dispatch(physioFileActions.setDataSaved(false));
						dispatch(modalsShowActions.setShowRassModal(false));
					}}>
					Izlaz
				</Button>,
			]}>
			<Header className={modalStyles.rassModalHeader}>
				<span>RASS - Richmond Agitation-Sedation Scale</span>
			</Header>
			<Segment>
				{(!rassList || !patientRassTests) && <LoadingSpinner />}
				{rassList && patientRassTests && (
					<Row>
						<Col span={7}>
							<Segment isContent>
								<DatePicker
									placeholder='Odaberi datum'
									format={croLocale.dateFormat} //TODO remove if PatientRassVM date string formating starts making problems with other formattings
									locale={croLocale}
									value={datePickerValue}
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
									value={additionalNotes}
									autoSize={{ minRows: 4 }}
									onChange={handleAdditionalNotesChange}
									placeholder='Dodatne zabilješke'
									style={{ maxWidth: "inherit" }}
									className={modalStyles.rassTextArea}
								/>
								<hr style={{ width: "0px" }} />
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
										className={modalStyles.modalsButtons}
										onClick={handleStopEditing}>
										Odustani
									</Button>
								)}
							</Segment>
						</Col>
						<Col span={17}>
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
