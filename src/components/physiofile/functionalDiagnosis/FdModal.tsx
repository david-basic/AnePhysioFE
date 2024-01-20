import { Button, Col, Modal, Row, Space, Table, Tooltip, message } from "antd";
import { ChangeEvent, useEffect, useState, type FC } from "react";
import modalStyles from "../../modals/ModalStyles.module.css";
import fileStyles from "../PhysioFile.module.css";
import Segment from "../segments/Segment";
import { Header } from "antd/es/layout/layout";
import LoadingSpinner from "../../LoadingSpinner";
import { useAppDispatch } from "../../../hooks/use_app_dispatch";
import { SaveFilled } from "@ant-design/icons";
import { physioFileActions } from "../../../store/physio-file-slice";
import confirm from "antd/es/modal/confirm";
import { InfoCircleFill, PencilFill, X } from "react-bootstrap-icons";
import { type ColumnsType } from "antd/es/table";
import useFetcApihWithTokenRefresh from "../../../hooks/use_fetch_api_with_token_refresh";
import { useAppSelector } from "../../../hooks/use_app_selector";
import { type PhysioFileVM } from "../../../models/physiofile/PhysioFileVM";
import { modalsShowActions } from "../../../store/modals-show-slice";
import generateRandomNumber from "../../../util/generateRandomBigInteger";
import { type FunctionalDiagnosisVM } from "../../../models/physiofile/functionalDiagnosis/FunctionalDiagnosisVM";
import isNullOrEmpty from "../../../util/isNullOrEmpty";
import TextArea from "antd/es/input/TextArea";
import { type UpdateFuncDiagRequestDto } from "../../../dto/PhysioFile/FuncDiag/UpdateFuncDiagRequestDto";
import { type CreateFuncDiagRequestDto } from "../../../dto/PhysioFile/FuncDiag/CreateFuncDiagRequestDto";
import api_routes from "../../../config/api_routes";
import { type ApiResponse, type NoReturnData } from "../../../type";
import { HttpStatusCode } from "axios";
import { type DeleteFunctionalDiagnosisRequestDto } from "../../../dto/PhysioFile/FuncDiag/DeleteFunctionalDiagnosisRequestDto";

type FdModalProps = {
	showModal: boolean;
	physioFile: PhysioFileVM;
	fdList: FunctionalDiagnosisVM[] | undefined;
};

type TableColumnDefinitionType = {
	key: string;
	id: string;
	description: string;
};

const FdModal: FC<FdModalProps> = ({
	showModal,
	physioFile,
	fdList,
}: FdModalProps) => {
	const dispatch = useAppDispatch();
	const { fetchWithTokenRefresh, isLoading } = useFetcApihWithTokenRefresh();
	const [tableIsBeingEdited, setTableIsBeingEdited] =
		useState<boolean>(false);
	const [dataSavedToTable, setDataSavedToTable] = useState<
		TableColumnDefinitionType[]
	>([]);
	const [tableRecordBeingEdited, setTableRecordBeingEdited] =
		useState<TableColumnDefinitionType>();
	const [fdDescription, setFdDescription] = useState<string>("");
	const fdModalDataSaved = useAppSelector(
		(state) => state.physioFileReducer.fdModalDataSaved
	);

	const columns: ColumnsType<TableColumnDefinitionType> = [
		{
			key: "fdId",
			width: 1,
			dataIndex: "id",
			render: (_, { id }) => (
				<div style={{ visibility: "hidden", width: 0, height: 0 }}>
					{id}
				</div>
			),
		},
		{
			key: "description",
			title: "Funkcionalna dijagnoza",
			width: 80,
			dataIndex: "description",
			render: (_, { description }) => <span>{description}</span>,
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
		fdList &&
			fdList.forEach((fd) =>
				setDataSavedToTable((prevState) => {
					const newState = [...prevState];
					newState.push({
						key: generateRandomNumber(9, true)!,
						id: fd.id,
						description: fd.description,
					});

					return newState;
				})
			);

		return () => {
			setDataSavedToTable([]);
		};
	}, [fdList]);

	const addDataToTable = () => {
		// TODO for some reason the state update of setDAtaSavedToTable does not update the table when state is set!
		setDataSavedToTable((prevState) => {
			const newState = [...prevState];
			const randNum = generateRandomNumber(12)!;
			newState.push({
				key: randNum,
				id: "",
				description: fdDescription,
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

	const sendAddFdRequest = async (fdDto: CreateFuncDiagRequestDto) => {
		try {
			fetchWithTokenRefresh(
				{
					url: api_routes.ROUTE_FUNC_DIAG_ADD_NEW,
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: fdDto,
				},
				(physioFileResponse: ApiResponse<PhysioFileVM>) => {
					if (physioFileResponse.status !== HttpStatusCode.Created) {
						message.error(
							"Nije moguće spremiti novu funkcionalnu dijagnozu!"
						);
						console.error(
							"There was a error while saving new functional diagnosis: ",
							physioFileResponse
						);
					} else {
						addDataToTable();

						dispatch(
							physioFileActions.setPhysioFile(
								physioFileResponse.data!
							)
						);
						message.success(
							"Nova funkcionalna dijagnoza uspješno spremljena!"
						);
						dispatch(
							physioFileActions.setPhysioFileDataSaved(false)
						);
					}
				}
			);
		} catch (error) {
			console.error("Error posting new functional diagnosis:", error);
			message.error("Neuspjelo spremanje nove funkcionalne dijagnoze!");
		}
	};

	const sendUpdateFdRequest = async (
		fdToEditId: string,
		updateDto: UpdateFuncDiagRequestDto
	) => {
		try {
			fetchWithTokenRefresh(
				{
					url:
						api_routes.ROUTE_FUNC_DIAG_UPDATE_FD_BY_ID +
						`/${fdToEditId}`,
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: updateDto,
				},
				(physioFileResponse: ApiResponse<PhysioFileVM>) => {
					if (physioFileResponse.status !== HttpStatusCode.Ok) {
						message.error(
							"Nije moguće izmjeniti funkcionalnu dijagnozu!"
						);
						console.error(
							"There was a error while updating functional diagnosis: ",
							physioFileResponse
						);
					} else {
						deleteRecordFromTable(tableRecordBeingEdited!);

						addDataToTable();

						dispatch(
							physioFileActions.setPhysioFile(
								physioFileResponse.data!
							)
						);
						message.success(
							"Funkcionalna dijagnoza uspješno izmijenjena!"
						);
						dispatch(
							physioFileActions.setPhysioFileDataSaved(false)
						);
					}
				}
			);
		} catch (error) {
			console.error("Error updating functional diagnosis:", error);
			message.error("Neuspjela izmjena funkcionalne dijagnoze!");
		}
	};

	const sendDeleteFdRequest = async (
		deleteDto: DeleteFunctionalDiagnosisRequestDto,
		recordToDelete: TableColumnDefinitionType
	) => {
		try {
			fetchWithTokenRefresh(
				{
					url: api_routes.ROUTE_FUNC_DIAG_DELETE_FD,
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: deleteDto,
				},
				(deleteFileResponse: ApiResponse<NoReturnData>) => {
					if (deleteFileResponse.status !== HttpStatusCode.Ok) {
						message.error(
							"Nije moguće izbrisati funkcionalnu dijagnozu!"
						);
						console.error(
							"There was a error while deleting functional diagnosis: ",
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

						message.success(
							"Funkcionalna dijagnoza uspješno izbrisana!"
						);
					}
				}
			);
		} catch (error) {
			console.error("Error deleting functional diagnosis:", error);
			message.error("Neuspjelo brisanje funkcionalne dijagnoze!");
		}
	};

	const onFdDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setFdDescription(event.target.value);
	};

	const handleSaveChoice = () => {
		if (isNullOrEmpty(fdDescription)) {
			return;
		}

		console.log("tableRecordBeingEdited...", tableRecordBeingEdited);

		if (tableIsBeingEdited) {
			const updateDto: UpdateFuncDiagRequestDto = {
				physioFileId: physioFile.id,
				description: tableRecordBeingEdited!.description,
			};

			sendUpdateFdRequest(tableRecordBeingEdited!.id, updateDto);
		} else {
			const createDto: CreateFuncDiagRequestDto = {
				physioFileId: physioFile.id,
				description: fdDescription,
			};

			sendAddFdRequest(createDto);
		}

		resetModalStates();
	};

	const handleEditChoice = (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		tableRecord: TableColumnDefinitionType
	) => {
		setTableIsBeingEdited(true);

		setFdDescription(tableRecord.description);

		setTableRecordBeingEdited({
			key: tableRecord.key,
			id: tableRecord.id,
			description: tableRecord.description,
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
				sendDeleteFdRequest(
					{ fdId: tableRecord.id, physioFileId: physioFile.id },
					tableRecord
				);
			},
		});
	};

	const handleSavingDataBeforeExit = () => {
		dispatch(physioFileActions.setPhysioFile(physioFile));
		dispatch(physioFileActions.setFuncDiagModalDataSaved(true));
	};

	const resetModalStates = () => {
		setFdDescription("");
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
						!fdModalDataSaved && handleSavingDataBeforeExit();
						resetModalStates();
						dispatch(modalsShowActions.setShowFdModal(false));
					}}>
					Izlaz
				</Button>,
			]}>
			<Header className={modalStyles.modalsHeader}>
				<span>Uređivanje funkcionalnih dijagnoza</span>
			</Header>
			<Segment>
				{!fdList && <LoadingSpinner />}
				{fdList && (
					<Row>
						<Col span={10}>
							<Segment isContent>
								<TextArea
									id='fdDescription'
									value={fdDescription}
									autoSize={{ minRows: 4 }}
									onChange={onFdDescriptionChange}
									placeholder='Zabilješka'
									style={{ maxWidth: "inherit" }}
									className={`${
										isNullOrEmpty(fdDescription)
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
									disabled={isNullOrEmpty(fdDescription)}
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

export default FdModal;
