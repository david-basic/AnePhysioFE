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
import styles from "../../components/layout/PhysioFileLayout.module.css";
import PatientDetails from "../../components/physiofile/patientDetails/PatientDetails";
import {
	CheckSquareFill,
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

const PatientPage: FC = () => {
	const patientId = getIdFromUrl(useLocation());

	//TODO store patient data to a state that will be active only while the user is on the carton, before exit you will ask
	// the user if they wish to exit before saving stored data, you will also keep a state called dataSaved which will be a boolean that will indicate saved state
	// the dataSaved state will change once POST is sent to the server to true and then user wont be asked before exit
	// instead of loadedOnce in session storage you will check for another state also called loadedOnce that will be persisted and only reset to false once
	// user saves their work so that reloading of data does not remove the changes, you will also use refs for the form like you did on login form.

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
	} = useAppSelector((state) => state.modalsShowReducer);
	const physioFile = useAppSelector(
		(state) => state.physioFileReducer.physioFile
	);
	const dataSaved = useAppSelector(
		(state) => state.physioFileReducer.physioFileDataSaved
	);
	const fdList = useAppSelector(state => state.physioFileReducer.functionalDiagnosisList);

	useEffect(() => {
		const fetchData = async () => {
			try {
				fetchWithTokenRefresh(
					{
						url:
							api_routes.ROUTE_PHYSIO_FILE_GET_BY_PATIENT_ID +
							`/${patientId}`,
						headers: { "Content-Type": "application/json" },
					},
					(physioFileResponse: ApiResponse<PhysioFileVM>) => {
						if (physioFileResponse.status !== HttpStatusCode.Ok) {
							navigate(-1);
							message.error(
								"Nije moguće dohvatiti fizioterapeutski karton!"
							);
							console.error(
								"There was a error fetching physio file: ",
								physioFileResponse
							);
						} else {
							dispatch(
								physioFileActions.setPhysioFile(
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
	}, [apiCallMade, dispatch, fetchWithTokenRefresh, navigate, patientId]);

	return (
		<>
			<Header
				style={{
					backgroundColor: "#5ac8fa",
					position: "fixed",
				}}
				className={styles.fileheader}>
				<PatientDetails patientData={physioFile.patient} />
			</Header>
			<Layout>
				<Layout>
					<Content
						className={styles.filecontent}
						style={{ backgroundColor: "#d1f2ff" }}>
						<PhysioFile
							physioFile={physioFile}
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
					className={styles.filesidebar}>
					<Flex
						vertical={true}
						align='center'
						style={{
							height: "inherit",
						}}>
						<div
							style={{ height: "100%" }}
							className={styles.testButtons}>
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
									physioFile.assessment.patientRass
										? physioFile.assessment.patientRass
										: null
								}
								assessment={
									physioFile.assessment
										? physioFile.assessment
										: null
								}
								rassList={physioFile.fullRassList}
							/>
							<TestsButton label='GCS' />
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
								physioFile={physioFile}
								physioTest={
									physioFile.physioTest
										? physioFile.physioTest
										: null
								}
								vasTests={
									physioFile.physioTest
										? physioFile.physioTest.vas
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
								physioFile={physioFile}
								physioTest={
									physioFile.physioTest
										? physioFile.physioTest
										: null
								}
								patientMmtTests={
									physioFile.physioTest
										? physioFile.physioTest.mmt
										: null
								}
								mmtList={physioFile.mmtList}
							/>
							<TestsButton label='CPAx' />
							<div
								style={{ height: "auto" }}
								className={styles.testButtons}>
								<TestsButton
									icon={<PrinterFill />}
									label='Ispis'
								/>
								<TestsButton
									icon={<CheckSquareFill />}
									label='Zaključi'
								/>
								<div
									style={{ height: "auto" }}
									className={styles.testButtons}>
									<TestsButton
										className={styles.saveButton}
										icon={<SaveFilled />}
										label='Spremi'
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
										showSaveModal={showSaveModal}
									/>
									<TestsButton
										className={styles.cancelButton}
										icon={<XCircleFill />}
										label='Odustani'
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
