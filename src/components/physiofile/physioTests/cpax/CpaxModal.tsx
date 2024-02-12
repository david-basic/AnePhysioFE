import { Fragment, useEffect, useState, type FC } from "react";
import { type PhysioFileVM } from "../../../../models/physiofile/PhysioFileVM";
import { type PhysioTestVM } from "../../../../models/physiofile/physioTests/PhysioTestVM";
import { type CpaxVM } from "../../../../models/physiofile/physioTests/cpax/CpaxVM";
import { type AopVM } from "../../../../models/physiofile/physioTests/cpax/AopVM";
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
import { useAppSelector } from "../../../../hooks/use_app_selector";
import useFetcApihWithTokenRefresh from "../../../../hooks/use_fetch_api_with_token_refresh";
import { SaveFilled } from "@ant-design/icons";
import modalStyles from "../../../modals/ModalStyles.module.css";
import fileStyles from "../../PhysioFile.module.css";
import {
	FileEarmarkExcel,
	InfoCircleFill,
	PencilFill,
	Search,
	X,
} from "react-bootstrap-icons";
import { modalsShowActions } from "../../../../store/modals-show-slice";
import { Header } from "antd/es/layout/layout";
import Segment from "../../segments/Segment";
import generateRandomNumber from "../../../../util/generateRandomBigInteger";
import api_routes from "../../../../config/api_routes";
import { type ApiResponse, type NoReturnData } from "../../../../type";
import { HttpStatusCode } from "axios";
import { physioFileActions } from "../../../../store/physio-file-slice";
import confirm from "antd/es/modal/confirm";
import LoadingSpinner from "../../../LoadingSpinner";
import isNullOrEmpty from "../../../../util/isNullOrEmpty";
import { ColumnsType } from "antd/es/table";
import { ListGroup } from "react-bootstrap";
import { DefinitionAopVM } from "../../../../models/physiofile/physioTests/cpax/DefinitionAopVM";
import RadarChart from "./RadarChart";
import SegmentTitle from "../../segments/SegmentTitle";
import { CreateCpaxRequestDto } from "../../../../dto/PhysioFile/PhysioTest/Cpax/CreateCpaxRequestDto";
import { UpdateCpaxRequestDto } from "../../../../dto/PhysioFile/PhysioTest/Cpax/UpdateCpaxRequestDto";
import { DeleteCpaxRequestDto } from "../../../../dto/PhysioFile/PhysioTest/Cpax/DeleteCpaxRequestDto";

export type CpaxDateTimeType = {
	date: string;
	time: string;
};

type AopAndIndex = {
	aop: DefinitionAopVM;
	index: number;
};

export type CpaxTableType = {
	respiratoryAOPandIndex: AopAndIndex;
	coughAOPandIndex: AopAndIndex;
	movingWithinBedAOPandIndex: AopAndIndex;
	supineToSittingAOPandIndex: AopAndIndex;
	dynamicSittingAOPandIndex: AopAndIndex;
	standingBalanceAOPandIndex: AopAndIndex;
	sitToStandAOPandIndex: AopAndIndex;
	transferringFromBedAOPandIndex: AopAndIndex;
	steppingAOPandIndex: AopAndIndex;
	gripStrengthAOPandIndex: AopAndIndex;
};

type TableColumnDefinitionType = {
	key: string;
	id: string;
	dateTime: CpaxDateTimeType;
	cpax: CpaxTableType;
};

type CpaxModalProps = {
	showModal: boolean;
	physioFile: PhysioFileVM;
	physioTest: PhysioTestVM | null;
	patientCpaxTests: CpaxVM[] | null;
	aopList: AopVM[];
};

const CpaxModal: FC<CpaxModalProps> = ({
	showModal,
	physioFile,
	physioTest,
	patientCpaxTests,
	aopList,
}: CpaxModalProps) => {
	const dispatch = useAppDispatch();
	const { fetchWithTokenRefresh } = useFetcApihWithTokenRefresh();
	const [tableIsBeingEdited, setTableIsBeingEdited] =
		useState<boolean>(false);
	const [dataSavedToTable, setDataSavedToTable] = useState<
		TableColumnDefinitionType[]
	>([]);
	const [tableRecordBeingEdited, setTableRecordBeingEdited] =
		useState<TableColumnDefinitionType>();
	const [datePickerValue, setDatePickerValue] = useState<Dayjs | null>(null);
	const [chosenDateTime, setChosenDateTime] = useState<CpaxDateTimeType>({
		date: "",
		time: "",
	});
	const respiratoryAOPs = aopList.filter(
		(aop) => aop.aspectName === "Dišna funkcija"
	);
	const coughAOPs = aopList.filter((aop) => aop.aspectName === "Kašalj");
	const movingWithinBedAOPs = aopList.filter(
		(aop) => aop.aspectName === "Mobilnost u krevetu"
	);
	const supineToSittingAOPs = aopList.filter(
		(aop) => aop.aspectName === "Posjedanje i sjedenje uz potporu"
	);
	const dynamicSittingAOPs = aopList.filter(
		(aop) => aop.aspectName === "Dinamičko samostalno sjedenje"
	);
	const standingBalanceAOPs = aopList.filter(
		(aop) => aop.aspectName === "Ravnoteža tijekom vertikalizacije"
	);
	const sitToStandAOPs = aopList.filter(
		(aop) => aop.aspectName === "Vertikalizacija iz sjedećeg položaja"
	);
	const transferringFromBedAOPs = aopList.filter(
		(aop) => aop.aspectName === "Transfer iz kreveta na stolac"
	);
	const steppingAOPs = aopList.filter(
		(aop) => aop.aspectName === "Koračanje u mjestu"
	);
	const gripStrengthAOPs = aopList.filter(
		(aop) => aop.aspectName === "Snaga stiska šake (dominantne ruke)"
	);
	const [clickedRespiratoryAOPindex, setClickedRespiratoryAOPindex] =
		useState<number>();
	const [clickedCoughAOPindex, setClickedCoughAOPindex] = useState<number>();
	const [clickedMovingWithinBedAOPindex, setClickedMovingWithinBedAOPindex] =
		useState<number>();
	const [clickedSupineToSittingAOPindex, setClickedSupineToSittingAOPindex] =
		useState<number>();
	const [clickedDynamicSittingAOPindex, setClickedDynamicSittingAOPindex] =
		useState<number>();
	const [clickedSitToStandAOPindex, setClickedSitToStandAOPindex] =
		useState<number>();
	const [clickedStandingBalanceAOPindex, setClickedStandingBalanceAOPindex] =
		useState<number>();
	const [
		clickedTransferringFromBedAOPindex,
		setClickedTransferringFromBedAOPindex,
	] = useState<number>();
	const [clickedSteppingAOPindex, setClickedSteppingAOPindex] =
		useState<number>();
	const [clickedGripStrengthAOPindex, setClickedGripStrengthAOPindex] =
		useState<number>();
	const cpaxModalDataSaved = useAppSelector(
		(state) => state.physioFileReducer.cpaxModalDataSaved
	);
	const [cpaxToDisplay, setCpaxToDisplay] = useState<CpaxTableType>();
	const [cpaxDateTimeToDisplay, setCpaxDateTimeToDisplay] =
		useState<CpaxDateTimeType>();
	const [chosenRespiratoryAopAndIndex, setChosenRespiratoryAopAndIndex] =
		useState<AopAndIndex | undefined>(undefined);
	const [chosenCoughAopAndIndex, setChosenCoughAopAndIndex] = useState<
		AopAndIndex | undefined
	>(undefined);
	const [
		chosenMovingWithinBedAopAndIndex,
		setChosenMovingWithinBedAopAndIndex,
	] = useState<AopAndIndex | undefined>(undefined);
	const [
		chosenSupineToSittingAopAndIndex,
		setChosenSupineToSittingAopAndIndex,
	] = useState<AopAndIndex | undefined>(undefined);
	const [
		chosenDynamicSittingAopAndIndex,
		setChosenDynamicSittingAopAndIndex,
	] = useState<AopAndIndex | undefined>(undefined);
	const [chosenSitToStandAopAndIndex, setChosenSitToStandAopAndIndex] =
		useState<AopAndIndex | undefined>(undefined);
	const [
		chosenStandingBalanceAopAndIndex,
		setChosenStandingBalanceAopAndIndex,
	] = useState<AopAndIndex | undefined>(undefined);
	const [
		chosenTransferringFromBedAopAndIndex,
		setChosenTransferringFromBedAopAndIndex,
	] = useState<AopAndIndex | undefined>(undefined);
	const [chosenSteppingAopAndIndex, setChosenSteppingAopAndIndex] = useState<
		AopAndIndex | undefined
	>(undefined);
	const [chosenGripStrengthAopAndIndex, setChosenGripStrengthAopAndIndex] =
		useState<AopAndIndex | undefined>(undefined);
	const dateOptions: Intl.DateTimeFormatOptions = {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		timeZone: "CET",
	};

	useEffect(() => {
		physioFile.physioTest !== null
			? physioFile.physioTest.cpax.forEach((cp) => {
					const cpaxDateTime = dayjs(cp.testDateTime).format(
						"YYYY.MM.DD HH:mm:ss"
					);

					const fetchedDateTime: CpaxDateTimeType = {
						date: cpaxDateTime.split(" ")[0],
						time: cpaxDateTime.split(" ")[1],
					};

					setDataSavedToTable((prevState) => {
						const newState = [...prevState];
						newState.push({
							key: generateRandomNumber(9, true)!,
							id: cp.id,
							dateTime: fetchedDateTime,
							cpax: {
								respiratoryAOPandIndex: {
									aop: cp.aspectOfPhysicality
										.respiratoryFunctionAOP,
									index: aopList
										.filter(
											(aop) =>
												aop.aspectName ===
												cp.aspectOfPhysicality
													.respiratoryFunctionAOP
													.aspectName
										)
										.findIndex(
											(a) =>
												a.level ===
												cp.aspectOfPhysicality
													.respiratoryFunctionAOP
													.level
										),
								},
								coughAOPandIndex: {
									aop: cp.aspectOfPhysicality.coughAOP,
									index: aopList
										.filter(
											(aop) =>
												aop.aspectName ===
												cp.aspectOfPhysicality.coughAOP
													.aspectName
										)
										.findIndex(
											(a) =>
												a.level ===
												cp.aspectOfPhysicality.coughAOP
													.level
										),
								},
								movingWithinBedAOPandIndex: {
									aop: cp.aspectOfPhysicality
										.movingWithinBedAOP,
									index: aopList
										.filter(
											(aop) =>
												aop.aspectName ===
												cp.aspectOfPhysicality
													.movingWithinBedAOP
													.aspectName
										)
										.findIndex(
											(a) =>
												a.level ===
												cp.aspectOfPhysicality
													.movingWithinBedAOP.level
										),
								},
								dynamicSittingAOPandIndex: {
									aop: cp.aspectOfPhysicality
										.dynamicSittingAOP,
									index: aopList
										.filter(
											(aop) =>
												aop.aspectName ===
												cp.aspectOfPhysicality
													.dynamicSittingAOP
													.aspectName
										)
										.findIndex(
											(a) =>
												a.level ===
												cp.aspectOfPhysicality
													.dynamicSittingAOP.level
										),
								},
								sitToStandAOPandIndex: {
									aop: cp.aspectOfPhysicality.sitToStandAOP,
									index: aopList
										.filter(
											(aop) =>
												aop.aspectName ===
												cp.aspectOfPhysicality
													.sitToStandAOP.aspectName
										)
										.findIndex(
											(a) =>
												a.level ===
												cp.aspectOfPhysicality
													.sitToStandAOP.level
										),
								},
								standingBalanceAOPandIndex: {
									aop: cp.aspectOfPhysicality
										.standingBalanceAOP,
									index: aopList
										.filter(
											(aop) =>
												aop.aspectName ===
												cp.aspectOfPhysicality
													.standingBalanceAOP
													.aspectName
										)
										.findIndex(
											(a) =>
												a.level ===
												cp.aspectOfPhysicality
													.standingBalanceAOP.level
										),
								},
								steppingAOPandIndex: {
									aop: cp.aspectOfPhysicality.steppingAOP,
									index: aopList
										.filter(
											(aop) =>
												aop.aspectName ===
												cp.aspectOfPhysicality
													.steppingAOP.aspectName
										)
										.findIndex(
											(a) =>
												a.level ===
												cp.aspectOfPhysicality
													.steppingAOP.level
										),
								},
								supineToSittingAOPandIndex: {
									aop: cp.aspectOfPhysicality
										.supineToSittingOnTheEdgeOfTheBedAOP,
									index: aopList
										.filter(
											(aop) =>
												aop.aspectName ===
												cp.aspectOfPhysicality
													.supineToSittingOnTheEdgeOfTheBedAOP
													.aspectName
										)
										.findIndex(
											(a) =>
												a.level ===
												cp.aspectOfPhysicality
													.supineToSittingOnTheEdgeOfTheBedAOP
													.level
										),
								},
								transferringFromBedAOPandIndex: {
									aop: cp.aspectOfPhysicality
										.transferringFromBedToChairAOP,
									index: aopList
										.filter(
											(aop) =>
												aop.aspectName ===
												cp.aspectOfPhysicality
													.transferringFromBedToChairAOP
													.aspectName
										)
										.findIndex(
											(a) =>
												a.level ===
												cp.aspectOfPhysicality
													.transferringFromBedToChairAOP
													.level
										),
								},
								gripStrengthAOPandIndex: {
									aop: cp.aspectOfPhysicality.gripStrengthAOP,
									index: aopList
										.filter(
											(aop) =>
												aop.aspectName ===
												cp.aspectOfPhysicality
													.gripStrengthAOP.aspectName
										)
										.findIndex(
											(a) =>
												a.level ===
												cp.aspectOfPhysicality
													.gripStrengthAOP.level
										),
								},
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
								physioFileActions.setCpaxModalDataSaved(false)
							);
						}
					}
			  );

		return () => {
			setDataSavedToTable([]);
		};
	}, [
		aopList,
		dispatch,
		fetchWithTokenRefresh,
		physioFile.id,
		physioFile.physioTest,
	]);

	const columns: ColumnsType<TableColumnDefinitionType> = [
		{
			key: "cpaxId",
			width: 1,
			dataIndex: "id",
			render: (_, { id }) => (
				<div style={{ visibility: "hidden", width: 0, height: 0 }}>
					{id}
				</div>
			),
		},
		{
			key: "cpaxDateTime",
			title: "Datum",
			dataIndex: "dateTime",
			width: 15,
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
			key: "cpax",
			title: "Ocjena",
			dataIndex: "cpax",
			width: 15,
			render: (_, { cpax }) => (
				<span>
					{cpax.coughAOPandIndex.aop.level +
						cpax.respiratoryAOPandIndex.aop.level +
						cpax.dynamicSittingAOPandIndex.aop.level +
						cpax.gripStrengthAOPandIndex.aop.level +
						cpax.movingWithinBedAOPandIndex.aop.level +
						cpax.sitToStandAOPandIndex.aop.level +
						cpax.standingBalanceAOPandIndex.aop.level +
						cpax.steppingAOPandIndex.aop.level +
						cpax.supineToSittingAOPandIndex.aop.level +
						cpax.transferringFromBedAOPandIndex.aop.level}
					/50
				</span>
			),
		},
		{
			key: "actions",
			title: "Akcije",
			width: 20,
			render: (_, record) => (
				<Space size={"small"}>
					<Button
						type='primary'
						disabled={tableIsBeingEdited}
						onClick={(e) => handleDisplayChoiceOnChart(e, record)}
						icon={<Search className={modalStyles.icon} />}
					/>
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

	const handleRespiratoryAOPclick = (
		event: React.MouseEvent<Element, MouseEvent>,
		index: number
	) => {
		const clickedLevel = parseInt(event.currentTarget.ariaValueText!);

		setClickedRespiratoryAOPindex((prevIndex) => {
			let newIndex = prevIndex;

			if (newIndex === index) {
				newIndex = undefined;
				setChosenRespiratoryAopAndIndex(undefined);
			} else {
				newIndex = index;
				const foundaop = respiratoryAOPs.find(
					(a) => a.level === clickedLevel
				);
				setChosenRespiratoryAopAndIndex({
					aop: foundaop!,
					index: index,
				});
			}

			return newIndex;
		});
	};

	const handleCoughAOPclick = (
		event: React.MouseEvent<Element, MouseEvent>,
		index: number
	) => {
		const clickedLevel = parseInt(event.currentTarget.ariaValueText!);

		setClickedCoughAOPindex((prevIndex) => {
			let newIndex = prevIndex;

			if (newIndex === index) {
				newIndex = undefined;
				setChosenCoughAopAndIndex(undefined);
			} else {
				newIndex = index;
				const foundaop = coughAOPs.find(
					(a) => a.level === clickedLevel
				);
				setChosenCoughAopAndIndex({
					aop: foundaop!,
					index: index,
				});
			}

			return newIndex;
		});
	};

	const handleMovingWithinBedAOPClick = (
		event: React.MouseEvent<Element, MouseEvent>,
		index: number
	) => {
		const clickedLevel = parseInt(event.currentTarget.ariaValueText!);

		setClickedMovingWithinBedAOPindex((prevIndex) => {
			let newIndex = prevIndex;

			if (newIndex === index) {
				newIndex = undefined;
				setChosenMovingWithinBedAopAndIndex(undefined);
			} else {
				newIndex = index;
				const foundaop = movingWithinBedAOPs.find(
					(a) => a.level === clickedLevel
				);
				setChosenMovingWithinBedAopAndIndex({
					aop: foundaop!,
					index: index,
				});
			}

			return newIndex;
		});
	};

	const handleSupineToSittingAOPClick = (
		event: React.MouseEvent<Element, MouseEvent>,
		index: number
	) => {
		const clickedLevel = parseInt(event.currentTarget.ariaValueText!);

		setClickedSupineToSittingAOPindex((prevIndex) => {
			let newIndex = prevIndex;

			if (newIndex === index) {
				newIndex = undefined;
				setChosenSupineToSittingAopAndIndex(undefined);
			} else {
				newIndex = index;
				const foundaop = supineToSittingAOPs.find(
					(a) => a.level === clickedLevel
				);
				setChosenSupineToSittingAopAndIndex({
					aop: foundaop!,
					index: index,
				});
			}

			return newIndex;
		});
	};

	const handleDynamicSittingAOPClick = (
		event: React.MouseEvent<Element, MouseEvent>,
		index: number
	) => {
		const clickedLevel = parseInt(event.currentTarget.ariaValueText!);

		setClickedDynamicSittingAOPindex((prevIndex) => {
			let newIndex = prevIndex;

			if (newIndex === index) {
				newIndex = undefined;
				setChosenDynamicSittingAopAndIndex(undefined);
			} else {
				newIndex = index;
				const foundaop = dynamicSittingAOPs.find(
					(a) => a.level === clickedLevel
				);
				setChosenDynamicSittingAopAndIndex({
					aop: foundaop!,
					index: index,
				});
			}

			return newIndex;
		});
	};

	const handleStandingBalanceAOPClick = (
		event: React.MouseEvent<Element, MouseEvent>,
		index: number
	) => {
		const clickedLevel = parseInt(event.currentTarget.ariaValueText!);

		setClickedStandingBalanceAOPindex((prevIndex) => {
			let newIndex = prevIndex;

			if (newIndex === index) {
				newIndex = undefined;
				setChosenStandingBalanceAopAndIndex(undefined);
			} else {
				newIndex = index;
				const foundaop = standingBalanceAOPs.find(
					(a) => a.level === clickedLevel
				);
				setChosenStandingBalanceAopAndIndex({
					aop: foundaop!,
					index: index,
				});
			}

			return newIndex;
		});
	};

	const handleSitToStandAOPclick = (
		event: React.MouseEvent<Element, MouseEvent>,
		index: number
	) => {
		const clickedLevel = parseInt(event.currentTarget.ariaValueText!);

		setClickedSitToStandAOPindex((prevIndex) => {
			let newIndex = prevIndex;

			if (newIndex === index) {
				newIndex = undefined;
				setChosenSitToStandAopAndIndex(undefined);
			} else {
				newIndex = index;
				const foundaop = sitToStandAOPs.find(
					(a) => a.level === clickedLevel
				);
				setChosenSitToStandAopAndIndex({
					aop: foundaop!,
					index: index,
				});
			}

			return newIndex;
		});
	};

	const handleTransferringFromBedAOPClick = (
		event: React.MouseEvent<Element, MouseEvent>,
		index: number
	) => {
		const clickedLevel = parseInt(event.currentTarget.ariaValueText!);

		setClickedTransferringFromBedAOPindex((prevIndex) => {
			let newIndex = prevIndex;

			if (newIndex === index) {
				newIndex = undefined;
				setChosenTransferringFromBedAopAndIndex(undefined);
			} else {
				newIndex = index;
				const foundaop = transferringFromBedAOPs.find(
					(a) => a.level === clickedLevel
				);
				setChosenTransferringFromBedAopAndIndex({
					aop: foundaop!,
					index: index,
				});
			}

			return newIndex;
		});
	};

	const handleSteppingAOPClick = (
		event: React.MouseEvent<Element, MouseEvent>,
		index: number
	) => {
		const clickedLevel = parseInt(event.currentTarget.ariaValueText!);

		setClickedSteppingAOPindex((prevIndex) => {
			let newIndex = prevIndex;

			if (newIndex === index) {
				newIndex = undefined;
				setChosenSteppingAopAndIndex(undefined);
			} else {
				newIndex = index;
				const foundaop = steppingAOPs.find(
					(a) => a.level === clickedLevel
				);
				setChosenSteppingAopAndIndex({
					aop: foundaop!,
					index: index,
				});
			}

			return newIndex;
		});
	};

	const handleGripStrengthAOPClick = (
		event: React.MouseEvent<Element, MouseEvent>,
		index: number
	) => {
		const clickedLevel = parseInt(event.currentTarget.ariaValueText!);

		setClickedGripStrengthAOPindex((prevIndex) => {
			let newIndex = prevIndex;

			if (newIndex === index) {
				newIndex = undefined;
				setChosenGripStrengthAopAndIndex(undefined);
			} else {
				newIndex = index;
				const foundaop = gripStrengthAOPs.find(
					(a) => a.level === clickedLevel
				);
				setChosenGripStrengthAopAndIndex({
					aop: foundaop!,
					index: index,
				});
			}

			return newIndex;
		});
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

	const addRecordToTable = (
		chosenCoughAopAndIndex: AopAndIndex,
		chosenDynamicSittingAopAndIndex: AopAndIndex,
		chosenGripStrengthAopAndIndex: AopAndIndex,
		chosenMovingWithinBedAopAndIndex: AopAndIndex,
		chosenRespiratoryAopAndIndex: AopAndIndex,
		chosenSitToStandAopAndIndex: AopAndIndex,
		chosenStandingBalanceAopAndIndex: AopAndIndex,
		chosenSteppingAopAndIndex: AopAndIndex,
		chosenSupineToSittingAopAndIndex: AopAndIndex,
		chosenTransferringFromBedAopAndIndex: AopAndIndex,
		chosenDateTime: CpaxDateTimeType
	) => {
		setDataSavedToTable((prevState) => {
			const newState = [...prevState];
			const randNum = generateRandomNumber(12)!;
			newState.push({
				key: randNum,
				id: "",
				dateTime: chosenDateTime,
				cpax: {
					coughAOPandIndex: chosenCoughAopAndIndex,
					dynamicSittingAOPandIndex: chosenDynamicSittingAopAndIndex,
					gripStrengthAOPandIndex: chosenGripStrengthAopAndIndex,
					movingWithinBedAOPandIndex:
						chosenMovingWithinBedAopAndIndex,
					respiratoryAOPandIndex: chosenRespiratoryAopAndIndex,
					sitToStandAOPandIndex: chosenSitToStandAopAndIndex,
					standingBalanceAOPandIndex:
						chosenStandingBalanceAopAndIndex,
					steppingAOPandIndex: chosenSteppingAopAndIndex,
					supineToSittingAOPandIndex:
						chosenSupineToSittingAopAndIndex,
					transferringFromBedAOPandIndex:
						chosenTransferringFromBedAopAndIndex,
				},
			});

			return newState;
		});
	};

	const sendCreateCpaxRequest = async (createDto: CreateCpaxRequestDto) => {
		try {
			fetchWithTokenRefresh(
				{
					url: api_routes.ROUTE_PHYSIO_TEST_ADD_NEW_CPAX,
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: createDto,
				},
				(physioFileResponse: ApiResponse<PhysioFileVM>) => {
					if (physioFileResponse.status !== HttpStatusCode.Created) {
						message.error("Nije moguće spremiti novi CPAx!");
						message.error(physioFileResponse.message);
						console.error(
							"There was a error while saving new CPAx: ",
							physioFileResponse
						);
					} else {
						addRecordToTable(
							chosenCoughAopAndIndex!,
							chosenDynamicSittingAopAndIndex!,
							chosenGripStrengthAopAndIndex!,
							chosenMovingWithinBedAopAndIndex!,
							chosenRespiratoryAopAndIndex!,
							chosenSitToStandAopAndIndex!,
							chosenStandingBalanceAopAndIndex!,
							chosenSteppingAopAndIndex!,
							chosenSupineToSittingAopAndIndex!,
							chosenTransferringFromBedAopAndIndex!,
							chosenDateTime
						);

						dispatch(
							physioFileActions.setCurrentPhysioFile(
								physioFileResponse.data!
							)
						);
						message.success("Novi CPAx uspješno spremljen!");
						dispatch(
							physioFileActions.setCpaxModalDataSaved(false)
						);
					}
				}
			);
		} catch (error) {
			console.error("Error posting new CPAx:", error);
			message.error("Neuspjelo spremanje novog CPAx-a!");
		}
	};

	const sendUpdateCpaxRequest = async (
		cpaxId: string,
		updateDto: UpdateCpaxRequestDto
	) => {
		try {
			fetchWithTokenRefresh(
				{
					url:
						api_routes.ROUTE_PHYSIO_TEST_UPDATE_CPAX_BY_ID +
						`/${cpaxId}`,
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: updateDto,
				},
				(physioFileResponse: ApiResponse<PhysioFileVM>) => {
					if (physioFileResponse.status !== HttpStatusCode.Ok) {
						message.error("Nije moguće izmjeniti CPAx!");
						message.error(physioFileResponse.message);
						console.error(
							"There was a error while updating CPAx: ",
							physioFileResponse
						);
					} else {
						dispatch(
							physioFileActions.setCurrentPhysioFile(
								physioFileResponse.data!
							)
						);

						deleteRecordFromTable(tableRecordBeingEdited!);

						addRecordToTable(
							chosenCoughAopAndIndex!,
							chosenDynamicSittingAopAndIndex!,
							chosenGripStrengthAopAndIndex!,
							chosenMovingWithinBedAopAndIndex!,
							chosenRespiratoryAopAndIndex!,
							chosenSitToStandAopAndIndex!,
							chosenStandingBalanceAopAndIndex!,
							chosenSteppingAopAndIndex!,
							chosenSupineToSittingAopAndIndex!,
							chosenTransferringFromBedAopAndIndex!,
							chosenDateTime
						);

						message.success("Izmjena CPAx-a uspješno spremljena!");
						dispatch(
							physioFileActions.setCpaxModalDataSaved(false)
						);
					}
				}
			);
		} catch (error) {
			console.error("Error updating CPAx:", error);
			message.error("Neuspjela izmjena CPAx-a!");
		}
	};

	const sendDeletePatientCpaxRequest = async (
		deleteDto: DeleteCpaxRequestDto,
		recordToDelete: TableColumnDefinitionType
	) => {
		try {
			fetchWithTokenRefresh(
				{
					url: api_routes.ROUTE_PHYSIO_TEST_DELETE_CPAX,
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: deleteDto,
				},
				(deleteFileResponse: ApiResponse<NoReturnData>) => {
					if (deleteFileResponse.status !== HttpStatusCode.Ok) {
						message.error("Nije moguće izbrisati CPAx!");
						message.error(deleteFileResponse.message);
						console.error(
							"There was a error while deleting CPAx: ",
							deleteFileResponse
						);
					} else {
						const newData = dataSavedToTable.filter(
							(item) => item.key !== recordToDelete.key
						);
						setDataSavedToTable(newData);
						dispatch(
							physioFileActions.setCpaxModalDataSaved(false)
						);

						message.success("CPAx uspješno izbrisan!");
					}
				}
			);
		} catch (error) {
			console.error("Error deleting CPAx:", error);
			message.error("Neuspjelo brisanje CPAx-a!");
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

	const handleSaveChoice = () => {
		if (
			isNullOrEmpty(chosenDateTime.date) ||
			clickedRespiratoryAOPindex === undefined ||
			clickedCoughAOPindex === undefined ||
			clickedDynamicSittingAOPindex === undefined ||
			clickedGripStrengthAOPindex === undefined ||
			clickedMovingWithinBedAOPindex === undefined ||
			clickedSitToStandAOPindex === undefined ||
			clickedStandingBalanceAOPindex === undefined ||
			clickedSteppingAOPindex === undefined ||
			clickedTransferringFromBedAOPindex === undefined ||
			clickedSupineToSittingAOPindex === undefined
		) {
			return;
		}

		if (tableIsBeingEdited) {
			const updateDto: UpdateCpaxRequestDto = {
				physioTestId: physioTest!.id,
				respiratoryAop: chosenRespiratoryAopAndIndex!.aop,
				coughAop: chosenCoughAopAndIndex!.aop,
				dynamicSittingAop: chosenDynamicSittingAopAndIndex!.aop,
				gripStrengthAop: chosenGripStrengthAopAndIndex!.aop,
				movingWithinBedAop: chosenMovingWithinBedAopAndIndex!.aop,
				sitToStandAop: chosenSitToStandAopAndIndex!.aop,
				standingBalanceAop: chosenStandingBalanceAopAndIndex!.aop,
				steppingAop: chosenSteppingAopAndIndex!.aop,
				transferringFromBedAop:
					chosenTransferringFromBedAopAndIndex!.aop,
				supineToSittingAop: chosenSupineToSittingAopAndIndex!.aop,
				cpaxDateTime: dayjs(
					`${chosenDateTime.date} ${chosenDateTime.time}`
				).format("YYYY-MM-DDTHH:mm:ss"),
			};

			sendUpdateCpaxRequest(tableRecordBeingEdited!.id, updateDto);
		} else {
			const createDto: CreateCpaxRequestDto = {
				physioTestId: physioTest!.id,
				respiratoryAop: chosenRespiratoryAopAndIndex!.aop,
				coughAop: chosenCoughAopAndIndex!.aop,
				dynamicSittingAop: chosenDynamicSittingAopAndIndex!.aop,
				gripStrengthAop: chosenGripStrengthAopAndIndex!.aop,
				movingWithinBedAop: chosenMovingWithinBedAopAndIndex!.aop,
				sitToStandAop: chosenSitToStandAopAndIndex!.aop,
				standingBalanceAop: chosenStandingBalanceAopAndIndex!.aop,
				steppingAop: chosenSteppingAopAndIndex!.aop,
				transferringFromBedAop:
					chosenTransferringFromBedAopAndIndex!.aop,
				supineToSittingAop: chosenSupineToSittingAopAndIndex!.aop,
				cpaxDateTime: dayjs(
					`${chosenDateTime.date} ${chosenDateTime.time}`
				).format("YYYY-MM-DDTHH:mm:ss"),
			};

			sendCreateCpaxRequest(createDto);
		}

		resetModalStates();
	};

	const handleDisplayChoiceOnChart = (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		tableRecord: TableColumnDefinitionType
	) => {
		setCpaxToDisplay(tableRecord.cpax);
		setCpaxDateTimeToDisplay(tableRecord.dateTime);
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

		setClickedCoughAOPindex(tableRecord.cpax.coughAOPandIndex.index);
		setClickedDynamicSittingAOPindex(
			tableRecord.cpax.dynamicSittingAOPandIndex.index
		);
		setClickedGripStrengthAOPindex(
			tableRecord.cpax.gripStrengthAOPandIndex.index
		);
		setClickedMovingWithinBedAOPindex(
			tableRecord.cpax.movingWithinBedAOPandIndex.index
		);
		setClickedRespiratoryAOPindex(
			tableRecord.cpax.respiratoryAOPandIndex.index
		);
		setClickedSitToStandAOPindex(
			tableRecord.cpax.sitToStandAOPandIndex.index
		);
		setClickedStandingBalanceAOPindex(
			tableRecord.cpax.standingBalanceAOPandIndex.index
		);
		setClickedSteppingAOPindex(tableRecord.cpax.steppingAOPandIndex.index);
		setClickedSupineToSittingAOPindex(
			tableRecord.cpax.supineToSittingAOPandIndex.index
		);
		setClickedTransferringFromBedAOPindex(
			tableRecord.cpax.transferringFromBedAOPandIndex.index
		);

		setChosenCoughAopAndIndex({
			aop: tableRecord.cpax.coughAOPandIndex.aop,
			index: tableRecord.cpax.coughAOPandIndex.index,
		});
		setChosenDynamicSittingAopAndIndex({
			aop: tableRecord.cpax.dynamicSittingAOPandIndex.aop,
			index: tableRecord.cpax.dynamicSittingAOPandIndex.index,
		});
		setChosenGripStrengthAopAndIndex({
			aop: tableRecord.cpax.gripStrengthAOPandIndex.aop,
			index: tableRecord.cpax.gripStrengthAOPandIndex.index,
		});
		setChosenMovingWithinBedAopAndIndex({
			aop: tableRecord.cpax.movingWithinBedAOPandIndex.aop,
			index: tableRecord.cpax.movingWithinBedAOPandIndex.index,
		});
		setChosenRespiratoryAopAndIndex({
			aop: tableRecord.cpax.respiratoryAOPandIndex.aop,
			index: tableRecord.cpax.respiratoryAOPandIndex.index,
		});
		setChosenSitToStandAopAndIndex({
			aop: tableRecord.cpax.sitToStandAOPandIndex.aop,
			index: tableRecord.cpax.sitToStandAOPandIndex.index,
		});
		setChosenStandingBalanceAopAndIndex({
			aop: tableRecord.cpax.standingBalanceAOPandIndex.aop,
			index: tableRecord.cpax.standingBalanceAOPandIndex.index,
		});
		setChosenSteppingAopAndIndex({
			aop: tableRecord.cpax.steppingAOPandIndex.aop,
			index: tableRecord.cpax.steppingAOPandIndex.index,
		});
		setChosenSupineToSittingAopAndIndex({
			aop: tableRecord.cpax.supineToSittingAOPandIndex.aop,
			index: tableRecord.cpax.supineToSittingAOPandIndex.index,
		});
		setChosenTransferringFromBedAopAndIndex({
			aop: tableRecord.cpax.transferringFromBedAOPandIndex.aop,
			index: tableRecord.cpax.transferringFromBedAOPandIndex.index,
		});

		setTableRecordBeingEdited({
			key: tableRecord.key,
			id: tableRecord.id,
			dateTime: tableRecord.dateTime,
			cpax: tableRecord.cpax,
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
				sendDeletePatientCpaxRequest(
					{
						cpaxId: tableRecord.id,
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

	const resetModalStates = () => {
		setClickedRespiratoryAOPindex(undefined);
		setClickedCoughAOPindex(undefined);
		setClickedMovingWithinBedAOPindex(undefined);
		setClickedSupineToSittingAOPindex(undefined);
		setClickedDynamicSittingAOPindex(undefined);
		setClickedSitToStandAOPindex(undefined);
		setClickedStandingBalanceAOPindex(undefined);
		setClickedTransferringFromBedAOPindex(undefined);
		setClickedSteppingAOPindex(undefined);
		setClickedGripStrengthAOPindex(undefined);
		setCpaxToDisplay(undefined);
		setCpaxDateTimeToDisplay(undefined);
		setChosenRespiratoryAopAndIndex(undefined);
		setChosenCoughAopAndIndex(undefined);
		setChosenMovingWithinBedAopAndIndex(undefined);
		setChosenSupineToSittingAopAndIndex(undefined);
		setChosenDynamicSittingAopAndIndex(undefined);
		setChosenSitToStandAopAndIndex(undefined);
		setChosenStandingBalanceAopAndIndex(undefined);
		setChosenTransferringFromBedAopAndIndex(undefined);
		setChosenSteppingAopAndIndex(undefined);
		setChosenGripStrengthAopAndIndex(undefined);
		setDatePickerValue(null);
		setChosenDateTime({ date: "", time: "" });
		setTableIsBeingEdited(false);
		setTableRecordBeingEdited(undefined);
	};

	const handleSavingDataBeforeExit = () => {
		dispatch(physioFileActions.setCurrentPhysioFile(physioFile));
		dispatch(physioFileActions.setCpaxModalDataSaved(true));
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
						!cpaxModalDataSaved && handleSavingDataBeforeExit();
						resetModalStates();
						dispatch(modalsShowActions.setShowCpaxModal(false));
					}}>
					Izlaz
				</Button>,
			]}>
			<Header className={modalStyles.modalsHeader}>
				<span>
					CPAx - Chelsea Critical Care Physical Assessment Tool
				</span>
			</Header>
			<Segment>
				{!physioTest && <LoadingSpinner />}
				{physioFile && physioTest && (
					<>
						<Row align={"top"}>
							<Col span={12}>
								<Segment
									isContent
									className={modalStyles.cpaxTableSegment}>
									<Table
										pagination={false}
										dataSource={dataSavedToTable}
										virtual
										scroll={{ y: 400, x: undefined }}
										columns={columns}
										className={modalStyles.cpaxTable}
										size='small'
									/>
								</Segment>
							</Col>
							<Col span={12}>
								<Segment isContent>
									{!cpaxToDisplay && (
										<div
											className={
												modalStyles.cpaxChartContainer
											}>
											<FileEarmarkExcel
												width={60}
												height={60}
											/>
											<SegmentTitle label='Izaberite podatke za prikaz CPAx testa iz tablice klikom na povećalo' />
										</div>
									)}
									{cpaxToDisplay && (
										<div
											className={
												modalStyles.cpaxChartContainer
											}>
											<RadarChart
												cpax={cpaxToDisplay}
												dateTime={
													cpaxDateTimeToDisplay!
												}
											/>
										</div>
									)}
								</Segment>
							</Col>
						</Row>
						<Row>
							<Col span={24}>
								<Segment isContent>
									<Row align={"middle"}>
										<Tooltip
											title='Datum te jedan level od svakog aspekta fizikalnosti su obavezni parametri!'
											color='#045fbd'
											style={{
												fontFamily:
													"Nunito, sans-serif",
											}}>
											<InfoCircleFill
												className={modalStyles.infoIcon}
											/>
										</Tooltip>
										<DatePicker
											placeholder='Odaberi datum'
											disabled={
												physioFile.fileClosedBy !== null
											}
											format={croLocale.dateFormat}
											locale={croLocale}
											value={datePickerValue}
											className={`${
												isNullOrEmpty(
													chosenDateTime.date
												)
													? modalStyles.notFilledHighlight
													: ""
											}`}
											onChange={onDatePickerChange}
										/>
									</Row>
									<hr style={{ width: "0px" }} />
									<ListGroup variant='flush'>
										<h3 className={fileStyles.titles}>
											{"Dišna funkcija"}
										</h3>
										{respiratoryAOPs.map((aop, index) => (
											<Fragment key={index}>
												<ListGroup.Item
													as={"a"}
													key={index}
													action
													aria-valuetext={aop.level.toString()}
													className={
														clickedRespiratoryAOPindex ===
														index
															? `${modalStyles.clickedRass}`
															: `${modalStyles.rassLinks}`
													}
													onClick={(e) =>
														physioFile.fileClosedBy ===
															null &&
														handleRespiratoryAOPclick(
															e,
															index
														)
													}>
													Level {aop.level}:{" "}
													{aop.levelDescription}
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
											{"Kašalj"}
										</h3>
										{coughAOPs.map((aop, index) => (
											<Fragment key={index}>
												<ListGroup.Item
													as={"a"}
													key={index}
													action
													aria-valuetext={aop.level.toString()}
													className={
														clickedCoughAOPindex ===
														index
															? `${modalStyles.clickedRass}`
															: `${modalStyles.rassLinks}`
													}
													onClick={(e) =>
														physioFile.fileClosedBy ===
															null &&
														handleCoughAOPclick(
															e,
															index
														)
													}>
													Level {aop.level}:{" "}
													{aop.levelDescription}
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
											{"Mobilnost u krevetu"}
										</h3>
										{movingWithinBedAOPs.map(
											(aop, index) => (
												<Fragment key={index}>
													<ListGroup.Item
														as={"a"}
														key={index}
														action
														aria-valuetext={aop.level.toString()}
														className={
															clickedMovingWithinBedAOPindex ===
															index
																? `${modalStyles.clickedRass}`
																: `${modalStyles.rassLinks}`
														}
														onClick={(e) =>
															physioFile.fileClosedBy ===
																null &&
															handleMovingWithinBedAOPClick(
																e,
																index
															)
														}>
														Level {aop.level}:{" "}
														{aop.levelDescription}
													</ListGroup.Item>
													<hr
														style={{
															width: "0px",
															margin: "0px",
															padding: "0px",
														}}
													/>
												</Fragment>
											)
										)}
										<hr style={{ width: "0px" }} />
										<h3 className={fileStyles.titles}>
											{"Posjedanje i sjedenje uz potporu"}
										</h3>
										{supineToSittingAOPs.map(
											(aop, index) => (
												<Fragment key={index}>
													<ListGroup.Item
														as={"a"}
														key={index}
														action
														aria-valuetext={aop.level.toString()}
														className={
															clickedSupineToSittingAOPindex ===
															index
																? `${modalStyles.clickedRass}`
																: `${modalStyles.rassLinks}`
														}
														onClick={(e) =>
															physioFile.fileClosedBy ===
																null &&
															handleSupineToSittingAOPClick(
																e,
																index
															)
														}>
														Level {aop.level}:{" "}
														{aop.levelDescription}
													</ListGroup.Item>
													<hr
														style={{
															width: "0px",
															margin: "0px",
															padding: "0px",
														}}
													/>
												</Fragment>
											)
										)}
										<hr style={{ width: "0px" }} />
										<h3 className={fileStyles.titles}>
											{"Dinamičko samostalno sjedenje"}
										</h3>
										{dynamicSittingAOPs.map(
											(aop, index) => (
												<Fragment key={index}>
													<ListGroup.Item
														as={"a"}
														key={index}
														action
														aria-valuetext={aop.level.toString()}
														className={
															clickedDynamicSittingAOPindex ===
															index
																? `${modalStyles.clickedRass}`
																: `${modalStyles.rassLinks}`
														}
														onClick={(e) =>
															physioFile.fileClosedBy ===
																null &&
															handleDynamicSittingAOPClick(
																e,
																index
															)
														}>
														Level {aop.level}:{" "}
														{aop.levelDescription}
													</ListGroup.Item>
													<hr
														style={{
															width: "0px",
															margin: "0px",
															padding: "0px",
														}}
													/>
												</Fragment>
											)
										)}
										<hr style={{ width: "0px" }} />
										<h3 className={fileStyles.titles}>
											{
												"Ravnoteža tijekom vertikalizacije"
											}
										</h3>
										{standingBalanceAOPs.map(
											(aop, index) => (
												<Fragment key={index}>
													<ListGroup.Item
														as={"a"}
														key={index}
														action
														aria-valuetext={aop.level.toString()}
														className={
															clickedStandingBalanceAOPindex ===
															index
																? `${modalStyles.clickedRass}`
																: `${modalStyles.rassLinks}`
														}
														onClick={(e) =>
															physioFile.fileClosedBy ===
																null &&
															handleStandingBalanceAOPClick(
																e,
																index
															)
														}>
														Level {aop.level}:{" "}
														{aop.levelDescription}
													</ListGroup.Item>
													<hr
														style={{
															width: "0px",
															margin: "0px",
															padding: "0px",
														}}
													/>
												</Fragment>
											)
										)}
										<hr style={{ width: "0px" }} />
										<h3 className={fileStyles.titles}>
											{
												"Vertikalizacija iz sjedećeg položaja"
											}
										</h3>
										{sitToStandAOPs.map((aop, index) => (
											<Fragment key={index}>
												<ListGroup.Item
													as={"a"}
													key={index}
													action
													aria-valuetext={aop.level.toString()}
													className={
														clickedSitToStandAOPindex ===
														index
															? `${modalStyles.clickedRass}`
															: `${modalStyles.rassLinks}`
													}
													onClick={(e) =>
														physioFile.fileClosedBy ===
															null &&
														handleSitToStandAOPclick(
															e,
															index
														)
													}>
													Level {aop.level}:{" "}
													{aop.levelDescription}
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
											{"Transfer iz kreveta na stolac"}
										</h3>
										{transferringFromBedAOPs.map(
											(aop, index) => (
												<Fragment key={index}>
													<ListGroup.Item
														as={"a"}
														key={index}
														action
														aria-valuetext={aop.level.toString()}
														className={
															clickedTransferringFromBedAOPindex ===
															index
																? `${modalStyles.clickedRass}`
																: `${modalStyles.rassLinks}`
														}
														onClick={(e) =>
															physioFile.fileClosedBy ===
																null &&
															handleTransferringFromBedAOPClick(
																e,
																index
															)
														}>
														Level {aop.level}:{" "}
														{aop.levelDescription}
													</ListGroup.Item>
													<hr
														style={{
															width: "0px",
															margin: "0px",
															padding: "0px",
														}}
													/>
												</Fragment>
											)
										)}
										<hr style={{ width: "0px" }} />
										<h3 className={fileStyles.titles}>
											{"Koračanje u mjestu"}
										</h3>
										{steppingAOPs.map((aop, index) => (
											<Fragment key={index}>
												<ListGroup.Item
													as={"a"}
													key={index}
													action
													aria-valuetext={aop.level.toString()}
													className={
														clickedSteppingAOPindex ===
														index
															? `${modalStyles.clickedRass}`
															: `${modalStyles.rassLinks}`
													}
													onClick={(e) =>
														physioFile.fileClosedBy ===
															null &&
														handleSteppingAOPClick(
															e,
															index
														)
													}>
													Level {aop.level}:{" "}
													{aop.levelDescription}
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
											{
												"Snaga stiska šake (dominantne ruke)"
											}
										</h3>
										{gripStrengthAOPs.map((aop, index) => (
											<Fragment key={index}>
												<ListGroup.Item
													as={"a"}
													key={index}
													action
													aria-valuetext={aop.level.toString()}
													className={
														clickedGripStrengthAOPindex ===
														index
															? `${modalStyles.clickedRass}`
															: `${modalStyles.rassLinks}`
													}
													onClick={(e) =>
														physioFile.fileClosedBy ===
															null &&
														handleGripStrengthAOPClick(
															e,
															index
														)
													}>
													Level {aop.level}:{" "}
													{aop.levelDescription}
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
											title='Datum te jedan level od svakog aspekta fizikalnosti su obavezni parametri!'
											color='#045fbd'
											style={{
												fontFamily:
													"Nunito, sans-serif",
											}}>
											<InfoCircleFill
												className={modalStyles.infoIcon}
											/>
										</Tooltip>
										<Button
											type='primary'
											shape='round'
											className={
												modalStyles.modalsButtons
											}
											icon={<SaveFilled />}
											disabled={
												isNullOrEmpty(
													chosenDateTime.date
												) ||
												clickedRespiratoryAOPindex ===
													undefined ||
												clickedCoughAOPindex ===
													undefined ||
												clickedDynamicSittingAOPindex ===
													undefined ||
												clickedGripStrengthAOPindex ===
													undefined ||
												clickedMovingWithinBedAOPindex ===
													undefined ||
												clickedSitToStandAOPindex ===
													undefined ||
												clickedStandingBalanceAOPindex ===
													undefined ||
												clickedSteppingAOPindex ===
													undefined ||
												clickedTransferringFromBedAOPindex ===
													undefined ||
												clickedSupineToSittingAOPindex ===
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
						</Row>
					</>
				)}
			</Segment>
		</Modal>
	);
};

export default CpaxModal;
