import { ChangeEvent, useEffect, useState, type FC } from "react";
import { type PhysioFileVM } from "../../../models/physiofile/PhysioFileVM";
import { type ProcedureVM } from "../../../models/physiofile/procedures/ProcedureVM";
import { type PatientProcedureVM } from "../../../models/physiofile/procedures/PatientProcedureVM";
import { type UserVM } from "../../../models/UserVm";
import { SaveFilled } from "@ant-design/icons";
import {
	Button,
	Col,
	DatePicker,
	DatePickerProps,
	Input,
	Row,
	Select,
	Space,
	Table,
	Tooltip,
	message,
} from "antd";
import "dayjs/locale/hr";
import dayjs, { type Dayjs } from "dayjs";
import croLocale from "antd/es/date-picker/locale/hr_HR";
import procedureStyles from "./Procedures.module.css";
import modalStyles from "../../modals/ModalStyles.module.css";
import isNullOrEmpty from "../../../util/isNullOrEmpty";
import { useAppDispatch } from "../../../hooks/use_app_dispatch";
import generateRandomNumber from "../../../util/generateRandomBigInteger";
import useFetcApihWithTokenRefresh from "../../../hooks/use_fetch_api_with_token_refresh";
import { ApiResponse, NoReturnData } from "../../../type";
import { ColumnsType } from "antd/es/table";
import fileStyles from "../PhysioFile.module.css";
import {
	InfoCircleFill,
	PencilFill,
	PlusCircle,
	X,
} from "react-bootstrap-icons";
import { CreatePatientProcedureRequestDto } from "../../../dto/PhysioFile/Procedure/CreatePatientProcedureRequestDto";
import { UpdatePatientProcedureRequestDto } from "../../../dto/PhysioFile/Procedure/UpdatePatientProcedureRequestDto";
import api_routes from "../../../config/api_routes";
import { HttpStatusCode } from "axios";
import { physioFileActions } from "../../../store/physio-file-slice";
import confirm from "antd/es/modal/confirm";
import { DeletePatientProcedureRequestDto } from "../../../dto/PhysioFile/Procedure/DeletePatientProcedureRequestDto";
import { useAppSelector } from "../../../hooks/use_app_selector";
import { modalsShowActions } from "../../../store/modals-show-slice";
import ProcedureModal from "./ProcedureModal";

type ProceduresProps = {
	physioFile: PhysioFileVM;
	procedureList: ProcedureVM[] | undefined;
	patientProcedureList: PatientProcedureVM[] | undefined;
	physioTherapistList: UserVM[] | undefined;
};

type ProceduresDateTimeType = {
	date: string;
	time: string;
};

type PatientProcedureTableType = Omit<PatientProcedureVM, "dateTime">;

type TableColumnDefinitionType = {
	key: string;
	dateTime: ProceduresDateTimeType;
	patientProc: PatientProcedureTableType;
};

const Procedures: FC<ProceduresProps> = ({
	physioFile,
	procedureList,
	patientProcedureList,
	physioTherapistList,
}: ProceduresProps) => {
	const dispatch = useAppDispatch();
	const showProcedureModal = useAppSelector(
		(state) => state.modalsShowReducer.showProcedureModal
	);
	const { fetchWithTokenRefresh } = useFetcApihWithTokenRefresh();
	const [datePickerValue, setDatePickerValue] = useState<Dayjs | null>(null);
	const [allProcedures, setAllProcedures] = useState<ProcedureVM[]>(
		procedureList || []
	);
	const [chosenProcedures, setChosenProcedures] = useState<ProcedureVM[]>([]);
	const [tableIsBeingEdited, setTableIsBeingEdited] =
		useState<boolean>(false);
	const [tableRecordBeingEdited, setTableRecordBeingEdited] = useState<
		TableColumnDefinitionType | undefined
	>();
	const [
		changedPatientProcedureDescription,
		setChangedPatientProcedureDescription,
	] = useState<string>("");
	const [chosenTherapistsIds, setChosenTherapistsIds] = useState<string[]>(
		[]
	);
	const [chosenDateTime, setChosenDateTime] =
		useState<ProceduresDateTimeType>({
			date: "",
			time: "",
		});
	const dateOptions: Intl.DateTimeFormatOptions = {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		timeZone: "CET",
	};
	const [dataSavedToTable, setDataSavedToTable] = useState<
		TableColumnDefinitionType[]
	>([]);

	useEffect(() => {
		patientProcedureList !== undefined
			? patientProcedureList.forEach((p) => {
					const procDateTime = dayjs(p.dateTime).format(
						"YYYY-MM-DD HH:mm:ss"
					);
					const fetchedDateTime: ProceduresDateTimeType = {
						date: procDateTime.split(" ")[0],
						time: procDateTime.split(" ")[1],
					};

					setDataSavedToTable((prevState) => {
						const newState = [...prevState];
						newState.push({
							key: generateRandomNumber(9, true)!,
							dateTime: fetchedDateTime,
							patientProc: {
								id: p.id,
								description: p.description,
								workingTherapists: p.workingTherapists,
							},
						});

						return newState;
					});
			  })
			: setDataSavedToTable([]);

		return () => {
			setDataSavedToTable([]);
		};
	}, [patientProcedureList]);

	const columns: ColumnsType<TableColumnDefinitionType> = [
		{
			key: "procId",
			width: 1,
			dataIndex: "patientProc",
			render: (_, { patientProc }) => (
				<div style={{ visibility: "hidden", width: 0, height: 0 }}>
					{patientProc.id}
				</div>
			),
		},
		{
			key: "procDateTime",
			title: "Datum",
			dataIndex: "dateTime",
			width: 10,
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
			key: "proc",
			title: "Procedure obavljene na pacijentu/ici",
			width: 55,
			dataIndex: "patientProc",
			render: (_, { patientProc }) => (
				<span>{patientProc.description}</span>
			),
		},
		{
			key: "therapists",
			title: "Fizioterapeuti",
			width: 15,
			dataIndex: "patientProc",
			render: (_, { patientProc }) => {
				const len = patientProc.workingTherapists.length;
				const string = patientProc.workingTherapists
					.map((t, index) => {
						return `${t.lastName}${index === len - 1 ? "" : ", "}`;
					})
					.join("");

				return <span>{string}</span>;
			},
		},
		{
			key: "actions",
			title: "Akcije",
			width: 12,
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

	const sendCreatePatientProcedureRequest = async (
		createDto: CreatePatientProcedureRequestDto
	) => {
		try {
			fetchWithTokenRefresh(
				{
					url: api_routes.ROUTE_PROCEDURE_ADD_NEW_PATIENT_PROCEDURE,
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: createDto,
				},
				(physioFileResponse: ApiResponse<PhysioFileVM>) => {
					if (physioFileResponse.status !== HttpStatusCode.Created) {
						message.error("Nije moguće spremiti novu proceduru!");
						message.error(physioFileResponse.message);
						console.error(
							"There was a error while saving new patient procedure: ",
							physioFileResponse
						);
					} else {
						addRecordToTable(
							changedPatientProcedureDescription,
							chosenTherapistsIds,
							chosenDateTime
						);

						dispatch(
							physioFileActions.setCurrentPhysioFile(
								physioFileResponse.data!
							)
						);
						message.success("Nova procedura uspješno spremljena!");
						dispatch(
							physioFileActions.setPhysioFileDataSaved(false)
						);
					}
				}
			);
		} catch (error) {
			console.error("Error posting new patient procedure:", error);
			message.error("Neuspjelo spremanje nove Procedure!");
		}
	};

	const sendUpdatePatientProcedureRequest = (
		patientProcedureId: string,
		updateDto: UpdatePatientProcedureRequestDto
	) => {
		try {
			fetchWithTokenRefresh(
				{
					url:
						api_routes.ROUTE_PROCEDURE_UPDATE_PATIENT_PROCEDURE_BY_ID +
						`/${patientProcedureId}`,
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: updateDto,
				},
				(physioFileResponse: ApiResponse<PhysioFileVM>) => {
					if (physioFileResponse.status !== HttpStatusCode.Ok) {
						message.error("Nije moguće izmjeniti proceduru!");
						message.error(physioFileResponse.message);
						console.error(
							"There was a error while updating patient procedure: ",
							physioFileResponse
						);
					} else {
						deleteRecordFromTable(tableRecordBeingEdited!);

						addRecordToTable(
							changedPatientProcedureDescription,
							chosenTherapistsIds,
							chosenDateTime
						);

						dispatch(
							physioFileActions.setCurrentPhysioFile(
								physioFileResponse.data!
							)
						);
						message.success("Procedura uspješno izmijenjena!");
						dispatch(
							physioFileActions.setPhysioFileDataSaved(false)
						);
					}
				}
			);
		} catch (error) {
			console.error("Error updating patient procedure:", error);
			message.error("Neuspjela izmjena procedure!");
		}
	};

	const sendDeletePatientProcedureRequest = (
		deleteDto: DeletePatientProcedureRequestDto,
		recordToDelete: TableColumnDefinitionType
	) => {
		try {
			fetchWithTokenRefresh(
				{
					url: api_routes.ROUTE_PROCEDURE_DELETE_PATIENT_PROCEDURE,
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: deleteDto,
				},
				(deleteFileResponse: ApiResponse<NoReturnData>) => {
					if (deleteFileResponse.status !== HttpStatusCode.Ok) {
						message.error("Nije moguće izbrisati proceduru!");
						message.error(deleteFileResponse.message);
						console.error(
							"There was a error while deleting patient procedure: ",
							deleteFileResponse
						);
					} else {
						const newData = dataSavedToTable.filter(
							(item) => item.key !== recordToDelete.key
						);
						setDataSavedToTable(newData);
						dispatch(
							physioFileActions.setPhysioFileDataSaved(false)
						);

						message.success("Procedura uspješno izbrisana!");
					}
				}
			);
		} catch (error) {
			console.error("Error deleting patient procedure:", error);
			message.error("Neuspjelo brisanje procedure!");
		}
	};

	const addRecordToTable = (
		newProcDescription: string,
		therapistIds: string[],
		dateTime: ProceduresDateTimeType
	) => {
		setDataSavedToTable((prevState) => {
			const newState = [...prevState];
			const randNum = generateRandomNumber(12)!;

			let therapists: UserVM[] = [];
			therapistIds.forEach((id) => {
				therapists.push(physioTherapistList!.find((t) => t.id === id)!);
			});

			newState.push({
				key: randNum,
				dateTime: dateTime,
				patientProc: {
					id: "",
					description: newProcDescription,
					workingTherapists: therapists,
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

		setChangedPatientProcedureDescription(
			tableRecord.patientProc.description
		);
		setChosenTherapistsIds(
			tableRecord.patientProc.workingTherapists.map((t) => t.id)
		);

		setTableIsBeingEdited(true);

		setTableRecordBeingEdited(tableRecord);
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
				sendDeletePatientProcedureRequest(
					{
						physioFileId: physioFile.id,
						patientProcedureId: tableRecord.patientProc.id,
					},
					tableRecord
				);
			},
		});
	};

	const onDatePickerChange: DatePickerProps["onChange"] = (
		date,
		dateString
	) => {
		if (isNullOrEmpty(dateString)) {
			setChosenDateTime({ date: "", time: "" });
			setDatePickerValue(null);
			setChangedPatientProcedureDescription("");
			setChosenTherapistsIds([]);
			setChosenProcedures([]);
			return;
		}

		const currentTime = dayjs().format("HH:mm:ss");

		setDatePickerValue(date);
		setChosenDateTime({ date: dateString, time: currentTime });
	};

	const changeProcedureHandler = (value: string[]) => {
		if (!value && !tableIsBeingEdited) {
			setChosenProcedures([]);
			setChangedPatientProcedureDescription("");
			setChosenTherapistsIds([]);
			return;
		}

		if (tableIsBeingEdited) {
			const procedures = value.map((id) => {
				return allProcedures!.find((p) => p.id === id)!;
			});
			setChosenProcedures(procedures);
			const len = procedures.length;
			const str = procedures
				.map((p, index) => {
					return `${
						index > 0 && p.description !== "ACBT"
							? p.description.toLowerCase()
							: p.description
					}${index === len - 1 ? "" : ", "}`;
				})
				.join("");

			setChangedPatientProcedureDescription(
				tableRecordBeingEdited!.patientProc.description + ", " + str
			);
		} else {
			const procedures = value.map((id) => {
				return allProcedures!.find((p) => p.id === id)!;
			});
			setChosenProcedures(procedures);
			const len = procedures.length;
			const str = procedures
				.map((p, index) => {
					return `${
						index > 0 && p.description !== "ACBT"
							? p.description.toLowerCase()
							: p.description
					}${index === len - 1 ? "" : ", "}`;
				})
				.join("");

			setChangedPatientProcedureDescription(str);
		}
	};

	const changeTherapistHandler = (value: string[]) => {
		if (!value) {
			setChosenTherapistsIds([]);
			return;
		}

		setChosenTherapistsIds(value);
	};

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setChangedPatientProcedureDescription(event.target.value);
	};

	const filterProcedureOptions = (
		input: string,
		option?: {
			label: string;
			value: string;
		}
	) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

	const filterTherapistOptions = (
		input: string,
		option?: {
			label: string;
			value: string;
		}
	) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

	const handleSaveChoice = () => {
		if (tableIsBeingEdited) {
			const updateDto: UpdatePatientProcedureRequestDto = {
				physioFileId: physioFile.id,
				description: changedPatientProcedureDescription,
				dateTime: `${chosenDateTime.date}T${chosenDateTime.time}`,
				workingTherapistsIds: chosenTherapistsIds,
			};

			sendUpdatePatientProcedureRequest(
				tableRecordBeingEdited!.patientProc.id,
				updateDto
			);
		} else {
			const createDto: CreatePatientProcedureRequestDto = {
				physioFileId: physioFile.id,
				description: changedPatientProcedureDescription,
				dateTime: `${chosenDateTime.date}T${chosenDateTime.time}`,
				workingTherapistsIds: chosenTherapistsIds,
			};

			sendCreatePatientProcedureRequest(createDto);
		}

		resetStates();
	};

	const handleStopEditing = () => {
		resetStates();
	};

	const resetStates = () => {
		setDatePickerValue(null);
		setChosenDateTime({ date: "", time: "" });
		setChosenProcedures([]);
		setChangedPatientProcedureDescription("");
		setChosenTherapistsIds([]);
		setTableIsBeingEdited(false);
		setTableRecordBeingEdited(undefined);
	};

	return (
		<Col>
			<Row
				align='middle'
				className={procedureStyles.row}
				style={{ marginBottom: "10px" }}>
				<DatePicker
					placeholder='Odaberi datum'
					disabled={physioFile.fileClosedBy !== null}
					format={croLocale.dateFormat}
					locale={croLocale}
					value={datePickerValue}
					className={`${
						isNullOrEmpty(chosenDateTime.date)
							? procedureStyles.notFilledHighlight
							: ""
					} ${procedureStyles.datePicker}`}
					onChange={onDatePickerChange}
				/>
				{datePickerValue !== null && (
					<Select
						showSearch
						allowClear
						mode='multiple'
						placeholder='Odaberi procedure pacijentu'
						className={procedureStyles.select}
						optionFilterProp='children'
						onChange={changeProcedureHandler}
						filterOption={filterProcedureOptions}
						options={allProcedures!.map((p) => {
							return { value: p.id, label: p.description };
						})}
					/>
				)}
			</Row>
			{(chosenProcedures.length > 0 || tableIsBeingEdited) && (
				<Row
					align='middle'
					className={procedureStyles.row}
					style={{ marginBottom: "10px" }}>
					<Input
						allowClear
						placeholder='Unesi proceduru pacijentu'
						value={changedPatientProcedureDescription}
						onChange={handleInputChange}
						className={procedureStyles.input}
					/>
					<Select
						showSearch
						allowClear
						placeholder='Odaberi fizioterapeute'
						mode='multiple'
						className={procedureStyles.select}
						optionFilterProp='children'
						defaultValue={chosenTherapistsIds}
						onChange={changeTherapistHandler}
						filterOption={filterTherapistOptions}
						options={physioTherapistList!.map((pt) => {
							return {
								value: pt.id,
								label: `${pt.firstName} ${pt.lastName}`,
							};
						})}
					/>
					<Tooltip
						title='Datum, pacijentove procedure i terapeuti su obavezni parametri'
						color='#045fbd'
						style={{
							fontFamily: "Nunito, sans-serif",
						}}>
						<InfoCircleFill
							className={modalStyles.infoIcon}
							style={{ marginLeft: "8px" }}
						/>
					</Tooltip>
					<Button
						type='primary'
						shape='round'
						className={modalStyles.modalsButtons}
						icon={<SaveFilled />}
						disabled={
							chosenTherapistsIds.length === 0 ||
							isNullOrEmpty(changedPatientProcedureDescription)
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
				</Row>
			)}
			<Row
				align='middle'
				className={procedureStyles.row}
				style={{ marginBottom: "10px" }}>
				<Button
					type='primary'
					icon={<PlusCircle />}
					disabled={physioFile.fileClosedBy !== null}
					onClick={() =>
						dispatch(modalsShowActions.setShowProcedureModal(true))
					}>
					<span
						style={{
							fontFamily: "Nunito, sans-serif",
							fontWeight: 700,
							fontSize: "16px",
						}}>
						Dodaj novu proceduru
					</span>
				</Button>
				<ProcedureModal
					showModal={showProcedureModal}
					procList={allProcedures}
					physioFile={physioFile}
					onAddProcedure={(newProcList) =>
						setAllProcedures(newProcList)
					}
					onUpdateProcedure={(newProcList) =>
						setAllProcedures(newProcList)
					}
					onRemoveProcedure={(newProcList) =>
						setAllProcedures(newProcList)
					}
				/>
			</Row>
			<Row align='middle' className={procedureStyles.row}>
				<Table
					pagination={false}
					dataSource={dataSavedToTable}
					virtual
					scroll={{ y: 400 }}
					columns={columns}
					className={procedureStyles.table}
					size='small'
				/>
			</Row>
		</Col>
	);
};

export default Procedures;
