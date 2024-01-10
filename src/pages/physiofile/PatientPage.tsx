import { useEffect, type FC, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getIdFromUrl } from "../../util/UrlHelper";
import api_routes from "../../config/api_routes";
import PhysioFile from "../../components/physiofile/PhysioFile";
import useFetcApihWithTokenRefresh from "../../hooks/use_fetch_api_with_token_refresh";
import { type ApiResponse } from "../../type";
import { type PhysioFileVM } from "../../models/physiofile/PhysioFileVM";
import { HttpStatusCode } from "axios";
import { Layout, message } from "antd";
import { useAppDispatch } from "../../hooks/use_app_dispatch";
import { physioFileActions } from "../../store/physio-file-slice";
import TestsButton from "../../components/physiofile/TestsButton";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import styles from "../../components/layout/PhysioFileLayout.module.css";
import PatientDetails from "../../components/physiofile/PatientDetails";

const PatientPage: FC = () => {
	const patientId = getIdFromUrl(useLocation());

	//TODO store patient data to a state that will be active only while the user is on the carton, before exit you will ask
	// the user if they wish to exit before saving stored data, you will also keep a state called dataSaved which will be a boolean that will indicate saved state
	// the dataSaved state will change once POST is sent to the server to true and then user wont be asked before exit
	// instead of loadedOnce in session storage you will check for another state also called loadedOnce that will be persisted and only reset to false once
	// user saves their work so that reloading of data does not remove the changes, you will also use refs for the form like you did on login form.

	const { fetchWithTokenRefresh, isLoading } = useFetcApihWithTokenRefresh();
	sessionStorage.setItem("loadedOnce", "false");
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [physioFileData, setPhysioFileData] = useState<PhysioFileVM>();

	useEffect(() => {
		if (sessionStorage.getItem("loadedOnce") !== "true") {
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
							setPhysioFileData(physioFileResponse.data);
							dispatch(
								physioFileActions.setPhysioFile(
									physioFileResponse.data!
								)
							);
							message.success(
								"Fizioterapeutski karton dohvaćen!"
							);
						}
					}
				);
			} catch (error) {
				console.error("Error loading Patient page:", error);
			}
		}

		return () => {
			sessionStorage.setItem("loadedOnce", "true");
		};
	}, [dispatch, fetchWithTokenRefresh, navigate, patientId]);

	return (
		<>
			<Header
				style={{
					backgroundColor: "#5ac8fa",
					position: "fixed",
				}}
				className={styles.fileheader}>
				<PatientDetails patientData={physioFileData?.patient} />
			</Header>
			<Layout>
				<Layout>
					<Content
						className={styles.filecontent}
						style={{ backgroundColor: "#d1f2ff" }}>
						<PhysioFile
							physioFile={physioFileData!}
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
					<TestsButton label='RASS' />
					<TestsButton label='GCS' />
					<TestsButton label='VAS' />
					<TestsButton label='MMT' />
					<TestsButton label='CPAx' />
				</Sider>
			</Layout>
		</>
	);
};

export default PatientPage;
