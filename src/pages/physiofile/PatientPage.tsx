import { useEffect, useRef, useState, type FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getIdFromUrl } from "../../util/UrlHelper";
import api_routes from "../../config/api_routes";
import PhysioFile from "../../components/physiofile/PhysioFile";
import useFetcApihWithTokenRefresh from "../../hooks/use_fetch_api_with_token_refresh";
import { type ApiResponse } from "../../type";
import { type PhysioFileVM } from "../../models/physiofile/PhysioFileVM";
import { HttpStatusCode } from "axios";
import { Flex, Layout, message } from "antd";
import { useAppDispatch } from "../../hooks/use_app_dispatch";
import { physioFileActions } from "../../store/physio-file-slice";
import TestsButton from "../../components/physiofile/physioTests/TestsButton";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import fileStyles from "../../components/layout/PhysioFileLayout.module.css";
import PatientDetails from "../../components/physiofile/patientDetails/PatientDetails";
import {
	CheckSquareFill,
	DoorOpenFill,
	PrinterFill,
	XCircleFill,
} from "react-bootstrap-icons";
import { SaveFilled } from "@ant-design/icons";
import { useAppSelector } from "../../hooks/use_app_selector";
import { modalsShowActions } from "../../store/modals-show-slice";
import ConfirmLeavePhysioFileModal from "../../components/modals/ConfirmLeavePhysioFileModal";
import ConfirmSavePhysioFileModal from "../../components/modals/ConfirmSavePhysioFileModal";
import RassModal from "../../components/physiofile/assessment/RassModal";
import VasModal from "../../components/physiofile/physioTests/vas/VasModal";
import MmtModal from "../../components/physiofile/physioTests/mmt/MmtModal";
import GcsModal from "../../components/physiofile/physioTests/gcs/GcsModal";
import CpaxModal from "../../components/physiofile/physioTests/cpax/CpaxModal";
import CustomLink from "../../components/CustomLink";
import client_routes, { clientRoutesParams } from "../../config/client_routes";
import ConfirmCloseFileModal from "../../components/modals/ConfirmCloseFileModal";

const PatientPage: FC = () => {
	const physioFileId = getIdFromUrl(useLocation());
	const { fetchWithTokenRefresh, isLoading } = useFetcApihWithTokenRefresh();
	const [apiCallMade, setApiCallMade] = useState(false);
	const isMounted = useRef(true);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const {
		showCpaxModal,
		showGcsModal,
		showLeaveModal,
		showMmtModal,
		showRassModal,
		showSaveModal,
		showVasModal,
		showCloseFileModal,
	} = useAppSelector((state) => state.modalsShowReducer);
	const currentPhysioFile = useAppSelector(
		(state) => state.physioFileReducer.currentPhysioFile
	);
	const dataSaved = useAppSelector(
		(state) => state.physioFileReducer.physioFileDataSaved
	);
	const fdList = useAppSelector(
		(state) => state.physioFileReducer.functionalDiagnosisList
	);

	useEffect(() => {
		const fetchData = async () => {
			try {
				fetchWithTokenRefresh(
					{
						url:
							api_routes.ROUTE_PHYSIO_FILE_GET_BY_ID +
							`/${physioFileId}`,
						headers: { "Content-Type": "application/json" },
					},
					(physioFileResponse: ApiResponse<PhysioFileVM>) => {
						if (physioFileResponse.status !== HttpStatusCode.Ok) {
							navigate(-1);
							message.error(
								"Nije moguće dohvatiti fizioterapeutski karton!"
							);
							message.error(physioFileResponse.message);
							console.error(
								"There was a error fetching physio file: ",
								physioFileResponse
							);
						} else {
							dispatch(
								physioFileActions.setCurrentPhysioFile(
									physioFileResponse.data!
								)
							);

							dispatch(
								physioFileActions.setFunctionalDiagnosisList(
									physioFileResponse.data!.patientFunctionalDiagnoses.map(
										(pfd) => pfd.functionalDiagnosis
									)
								)
							);

							message.success(
								"Fizioterapeutski karton dohvaćen!"
							);

							dispatch(
								modalsShowActions.setShowChoosePhysioFileModal(
									false
								)
							);
						}

						setApiCallMade(true);
						sessionStorage.setItem("apiCallMade", "true");
					}
				);
			} catch (error) {
				console.error("Error loading Patient page:", error);
			}
		};

		const apiCallAlreadyMade =
			sessionStorage.getItem("apiCallMade") === "true";
		if (!apiCallMade && !apiCallAlreadyMade) {
			fetchData();
		}

		return () => {
			if (isMounted.current) {
				setApiCallMade(false);
				sessionStorage.removeItem("apiCallMade");
				isMounted.current = false;
			}
		};
	}, [apiCallMade, dispatch, fetchWithTokenRefresh, navigate, physioFileId]);

	return (
		<>
			<Header
				style={{
					backgroundColor: "#023f81",
					position: "fixed",
				}}
				className={fileStyles.fileheader}>
				<PatientDetails patientData={currentPhysioFile.patient} />
			</Header>
			<Layout>
				<Layout>
					<Content
						className={fileStyles.filecontent}
						style={{ backgroundColor: "#d1f2ff" }}>
						<PhysioFile
							physioFile={currentPhysioFile}
							fdList={fdList}
							isLoading={isLoading}
						/>
					</Content>
				</Layout>
				<Sider
					width={"335px"}
					style={{
						backgroundColor: "#1d82ea",
						position: "fixed",
					}}
					className={fileStyles.filesidebar}>
					<Flex
						vertical={true}
						align='center'
						style={{
							height: "inherit",
						}}>
						<div
							style={{ height: "100%" }}
							className={fileStyles.testButtons}>
							<TestsButton
								label='RASS'
								onClick={() =>
									dispatch(
										modalsShowActions.setShowRassModal(true)
									)
								}
							/>
							<RassModal
								showModal={showRassModal}
								patientRassTests={
									currentPhysioFile.assessment.patientRass
										? currentPhysioFile.assessment
												.patientRass
										: null
								}
								assessment={
									currentPhysioFile.assessment
										? currentPhysioFile.assessment
										: null
								}
								rassList={currentPhysioFile.fullRassList}
							/>
							<TestsButton
								label='GCS'
								onClick={() =>
									dispatch(
										modalsShowActions.setShowGcsModal(true)
									)
								}
							/>
							<GcsModal
								showModal={showGcsModal}
								physioFile={currentPhysioFile}
								physioTest={
									currentPhysioFile.physioTest
										? currentPhysioFile.physioTest
										: null
								}
								gcsEyeResponses={
									currentPhysioFile.allEyeOpeningResponses
								}
								gcsMotorResponses={
									currentPhysioFile.allMotorResponses
								}
								gcsVerbalResponses={
									currentPhysioFile.allVerbalResponses
								}
							/>
							<TestsButton
								label='VAS'
								onClick={() =>
									dispatch(
										modalsShowActions.setShowVasModal(true)
									)
								}
							/>
							<VasModal
								showModal={showVasModal}
								physioFile={currentPhysioFile}
								physioTest={
									currentPhysioFile.physioTest
										? currentPhysioFile.physioTest
										: null
								}
								vasTests={
									currentPhysioFile.physioTest
										? currentPhysioFile.physioTest.vas
										: null
								}
							/>
							<TestsButton
								label='MMT'
								onClick={() =>
									dispatch(
										modalsShowActions.setShowMmtModal(true)
									)
								}
							/>
							<MmtModal
								showModal={showMmtModal}
								physioFile={currentPhysioFile}
								physioTest={
									currentPhysioFile.physioTest
										? currentPhysioFile.physioTest
										: null
								}
								patientMmtTests={
									currentPhysioFile.physioTest
										? currentPhysioFile.physioTest.mmt
										: null
								}
								mmtList={currentPhysioFile.mmtList}
							/>
							<TestsButton
								label='CPAx'
								onClick={() =>
									dispatch(
										modalsShowActions.setShowCpaxModal(true)
									)
								}
							/>
							<CpaxModal
								showModal={showCpaxModal}
								physioFile={currentPhysioFile}
								physioTest={
									currentPhysioFile.physioTest
										? currentPhysioFile.physioTest
										: null
								}
								patientCpaxTests={
									currentPhysioFile.physioTest
										? currentPhysioFile.physioTest.cpax
										: null
								}
								aopList={
									currentPhysioFile.allAspectsOfPhysicality
								}
							/>
							<div
								style={{ height: "auto" }}
								className={fileStyles.testButtons}>
								<CustomLink
									to={client_routes.ROUTE_PRINTING_PAGE.replace(
										clientRoutesParams.patientId,
										physioFileId
									)}
									askForConfirmation
									confirmationText='Jeste li sigurni? Sve nespremljene promjene se neće moći ispisati!'
									icon={<PrinterFill />}
									label='Ispis'
								/>
								<TestsButton
									icon={<CheckSquareFill />}
									label='Zaključi'
									className={fileStyles.cancelButton}
									disabled={
										currentPhysioFile.fileClosedBy !== null
									}
									onClick={() =>
										dispatch(
											modalsShowActions.setShowCloseFileModal(
												true
											)
										)
									}
								/>
								<ConfirmCloseFileModal
									physioFile={currentPhysioFile}
									showCloseFileModal={showCloseFileModal}
								/>
								<div
									style={{ height: "auto" }}
									className={fileStyles.testButtons}>
									<TestsButton
										className={fileStyles.saveButton}
										icon={<SaveFilled />}
										label='Spremi'
										disabled={
											currentPhysioFile.fileClosedBy !==
											null
										}
										onClick={() =>
											!dataSaved &&
											dispatch(
												modalsShowActions.setShowSaveModal(
													true
												)
											)
										}
									/>
									<ConfirmSavePhysioFileModal
										physioFile={currentPhysioFile}
										showSaveModal={showSaveModal}
									/>
									<TestsButton
										className={fileStyles.cancelButton}
										icon={
											currentPhysioFile.fileClosedBy ===
											null ? (
												<XCircleFill />
											) : (
												<DoorOpenFill />
											)
										}
										label={`${
											currentPhysioFile.fileClosedBy ===
											null
												? "Odustani"
												: "Izlaz"
										}`}
										onClick={() =>
											!dataSaved
												? dispatch(
														modalsShowActions.setShowLeaveModal(
															true
														)
												  )
												: navigate(-1)
										}
									/>
									<ConfirmLeavePhysioFileModal
										showLeaveModal={showLeaveModal}
									/>
								</div>
							</div>
						</div>
					</Flex>
				</Sider>
			</Layout>
		</>
	);
};

export default PatientPage;
