import React, { ChangeEvent, useEffect, useState, type FC } from "react";
import { type ProcedureVM } from "../../../models/physiofile/procedures/ProcedureVM";
import { useAppDispatch } from "../../../hooks/use_app_dispatch";
import useFetcApihWithTokenRefresh from "../../../hooks/use_fetch_api_with_token_refresh";
import { useAppSelector } from "../../../hooks/use_app_selector";
import Table, { ColumnsType } from "antd/es/table";
import { InfoCircleFill, PencilFill, X } from "react-bootstrap-icons";
import { SaveFilled } from "@ant-design/icons";
import { Button, Col, Modal, Row, Space, Tooltip, message } from "antd";
import modalStyles from "../../modals/ModalStyles.module.css";
import fileStyles from "../PhysioFile.module.css";
import generateRandomNumber from "../../../util/generateRandomBigInteger";
import confirm from "antd/es/modal/confirm";
import { physioFileActions } from "../../../store/physio-file-slice";
import { type PhysioFileVM } from "../../../models/physiofile/PhysioFileVM";
import { type DeleteProcedureRequestDto } from "../../../dto/PhysioFile/Procedure/DeleteProcedureRequestDto";
import api_routes from "../../../config/api_routes";
import { ApiResponse } from "../../../type";
import { HttpStatusCode } from "axios";
import { modalsShowActions } from "../../../store/modals-show-slice";
import { Header } from "antd/es/layout/layout";
import LoadingSpinner from "../../LoadingSpinner";
import Segment from "../segments/Segment";
import TextArea from "antd/es/input/TextArea";
import isNullOrEmpty from "../../../util/isNullOrEmpty";
import { type CreateProcedureRequestDto } from "../../../dto/PhysioFile/Procedure/CreateProcedureRequestDto";
import { type UpdateProcedureRequestDto } from "../../../dto/PhysioFile/Procedure/UpdateProcedureRequestDto";

type ProcedureModalProps = {
	showModal: boolean;
	procList: ProcedureVM[];
	physioFile: PhysioFileVM;
	onAddProcedure: (newProcList: ProcedureVM[]) => void;
	onUpdateProcedure: (newProcList: ProcedureVM[]) => void;
	onRemoveProcedure: (newProcList: ProcedureVM[]) => void;
};

type TableColumnDefinitionType = {
	key: string;
	procedure: ProcedureVM;
};

const ProcedureModal: FC<ProcedureModalProps> = ({
	showModal,
	procList,
	physioFile,
	onAddProcedure,
	onUpdateProcedure,
	onRemoveProcedure,
}: ProcedureModalProps) => {
	const dispatch = useAppDispatch();
	const { fetchWithTokenRefresh, isLoading } = useFetcApihWithTokenRefresh();
	const [tableIsBeingEdited, setTableIsBeingEdited] =
		useState<boolean>(false);
	const [dataSavedToTable, setDataSavedToTable] = useState<
		TableColumnDefinitionType[]
	>([]);
	const [tableRecordBeingEdited, setTableRecordBeingEdited] =
		useState<TableColumnDefinitionType>();
	const [procedureDescription, setProcedureDescription] =
		useState<string>("");
	const procedureModalDataSaved = useAppSelector(
		(state) => state.physioFileReducer.procedureModalDataSaved
	);

	const columns: ColumnsType<TableColumnDefinitionType> = [
		{
			key: "description",
			title: "Procedura",
			width: 80,
			dataIndex: "procedure",
			render: (_, { procedure }) => <span>{procedure.description}</span>,
		},
		{
			key: "actions",
			title: "Akcije",
			width: 15,
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
		procList &&
			procList.forEach((p) =>
				setDataSavedToTable((prevState) => {
					const newState = [...prevState];
					newState.push({
						key: generateRandomNumber(9, true)!,
						procedure: {
							id: p.id,
							description: p.description,
						},
					});

					return newState;
				})
			);

		return () => {
			setDataSavedToTable([]);
		};
	}, [procList]);

	const sendDeleteProcedureRequest = async (
		deleteDto: DeleteProcedureRequestDto,
		recordToDelete: TableColumnDefinitionType
	) => {
		try {
			fetchWithTokenRefresh(
				{
					url: api_routes.ROUTE_PROCEDURE_DELETE_PROCEDURE,
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: deleteDto,
				},
				(deleteFileResponse: ApiResponse<PhysioFileVM>) => {
					if (deleteFileResponse.status !== HttpStatusCode.Ok) {
						message.error("Nije moguće izbrisati proceduru!");
						message.error(deleteFileResponse.message);
						console.error(
							"There was a error while deleting procedure: ",
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
						dispatch(
							physioFileActions.setCurrentPhysioFile(
								deleteFileResponse.data!
							)
						);

						onRemoveProcedure(
							deleteFileResponse.data!.fullProcedureList
						);

						message.success("Procedura uspješno izbrisana!");
					}
				}
			);
		} catch (error) {
			console.error("Error deleting procedure:", error);
			message.error("Neuspjelo brisanje procedure!");
		}
	};

	const sendAddProcedureRequest = async (
		createDto: CreateProcedureRequestDto
	) => {
		try {
			fetchWithTokenRefresh(
				{
					url: api_routes.ROUTE_PROCEDURE_ADD_NEW_PROCEDURE,
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: createDto,
				},
				(physioFileResponse: ApiResponse<PhysioFileVM>) => {
					if (physioFileResponse.status !== HttpStatusCode.Created) {
						message.error("Nije moguće spremiti novu proceduru!");
						message.error(physioFileResponse.message);
						console.error(
							"There was a error while saving new procedure: ",
							physioFileResponse
						);
					} else {
						const newRecord =
							physioFileResponse.data!.fullProcedureList.filter(
								(p) => p.description === procedureDescription
							)[0];

						addRecordToTable(newRecord);

						onAddProcedure(
							physioFileResponse.data!.fullProcedureList
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
			console.error("Error posting new procedure:", error);
			message.error("Neuspjelo spremanje nove procedure!");
		}
	};

	const sendUpdateProcedureRequest = async (
		procedureToEditId: string,
		updateDto: UpdateProcedureRequestDto
	) => {
		try {
			fetchWithTokenRefresh(
				{
					url:
						api_routes.ROUTE_PROCEDURE_UPDATE_PROCEDURE_BY_ID +
						`/${procedureToEditId}`,
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: updateDto,
				},
				(physioFileResponse: ApiResponse<PhysioFileVM>) => {
					if (physioFileResponse.status !== HttpStatusCode.Ok) {
						message.error("Nije moguće izmjeniti proceduru!");
						message.error(physioFileResponse.message);
						console.error(
							"There was a error while updating procedure: ",
							physioFileResponse
						);
					} else {
						const newRecord =
							physioFileResponse.data!.fullProcedureList.filter(
								(p) => p.description === procedureDescription
							)[0];

						deleteRecordFromTable(tableRecordBeingEdited!);

						addRecordToTable(newRecord);

						dispatch(
							physioFileActions.setCurrentPhysioFile(
								physioFileResponse.data!
							)
						);

						onUpdateProcedure(
							physioFileResponse.data!.fullProcedureList
						);

						message.success("Procedura uspješno izmijenjena!");
						dispatch(
							physioFileActions.setPhysioFileDataSaved(false)
						);
					}
				}
			);
		} catch (error) {
			console.error("Error updating procedure:", error);
			message.error("Neuspjela izmjena procedure!");
		}
	};

	const deleteRecordFromTable = (
		recordToDelete: TableColumnDefinitionType
	) => {
		const newData = dataSavedToTable.filter(
			(item) => item.key !== recordToDelete.key
		);
		setDataSavedToTable(newData);
	};

	const addRecordToTable = (newRecord: ProcedureVM) => {
		setDataSavedToTable((prevState) => {
			const newState = [...prevState];
			const randNum = generateRandomNumber(12)!;
			newState.push({
				key: randNum,
				procedure: newRecord,
			});

			return newState;
		});
	};

	const handleSaveChoice = () => {
		if (isNullOrEmpty(procedureDescription)) {
			return;
		}

		if (tableIsBeingEdited) {
			const updateDto: UpdateProcedureRequestDto = {
				physioFileId: physioFile.id,
				description: procedureDescription,
			};

			sendUpdateProcedureRequest(
				tableRecordBeingEdited!.procedure.id,
				updateDto
			);
		} else {
			const createDto: CreateProcedureRequestDto = {
				physioFileId: physioFile.id,
				description: procedureDescription,
			};

			sendAddProcedureRequest(createDto);
		}

		resetModalStates();
	};

	const onProcedureDescriptionChange = (
		event: ChangeEvent<HTMLTextAreaElement>
	) => {
		setProcedureDescription(event.target.value);
	};

	const handleEditChoice = (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		tableRecord: TableColumnDefinitionType
	) => {
		setTableIsBeingEdited(true);
		setProcedureDescription(tableRecord.procedure.description);

		setTableRecordBeingEdited({
			key: tableRecord.key,
			procedure: tableRecord.procedure,
		});
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
				sendDeleteProcedureRequest(
					{
						physioFileId: physioFile.id,
						procedureId: tableRecord.procedure.id,
					},
					tableRecord
				);
			},
		});
	};

	const handleSavingDataBeforeExit = () => {
		dispatch(physioFileActions.setProcedureModalDataSaved(true));
	};

	const resetModalStates = () => {
		setProcedureDescription("");
		setTableRecordBeingEdited(undefined);
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
						!procedureModalDataSaved &&
							handleSavingDataBeforeExit();
						resetModalStates();
						dispatch(
							modalsShowActions.setShowProcedureModal(false)
						);
					}}>
					Izlaz
				</Button>,
			]}>
			<Header className={modalStyles.modalsHeader}>
				<span>Uređivanje procedura</span>
			</Header>
			<Segment>
				{!procList && <LoadingSpinner />}
				{procList && (
					<Row>
						<Col span={10}>
							<Segment isContent>
								<TextArea
									id='procDescription'
									value={procedureDescription}
									autoSize={{ minRows: 4 }}
									onChange={onProcedureDescriptionChange}
									placeholder='Opis procedure'
									style={{ maxWidth: "inherit" }}
									className={`${
										isNullOrEmpty(procedureDescription)
											? modalStyles.notFilledHighlight
											: ""
									} ${modalStyles.modalsTextArea}`}
								/>
								<hr style={{ width: "0px" }} />
								<Tooltip
									title='Opis je obavezan parametar!'
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
									disabled={isNullOrEmpty(
										procedureDescription
									)}
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
						<Col span={14}>
							<Segment
								isContent
								className={modalStyles.tableSegment}>
								{isLoading && <LoadingSpinner />}
								{!isLoading && (
									<Table
										pagination={false}
										dataSource={dataSavedToTable}
										virtual
										scroll={{ y: 400 }}
										columns={columns}
										className={modalStyles.fdTable}
										size='small'
									/>
								)}
							</Segment>
						</Col>
					</Row>
				)}
			</Segment>
		</Modal>
	);
};

export default ProcedureModal;
