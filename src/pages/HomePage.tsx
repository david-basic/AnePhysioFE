import { useEffect, useState, type FC } from "react";
import localStyles from "./HomePage.module.css";
import { Button, Col, Modal, Row, Tooltip, message } from "antd";
import CustomLink from "../components/CustomLink";
import { useAppDispatch } from "../hooks/use_app_dispatch";
import { useAppSelector } from "../hooks/use_app_selector";
import useFetchApi from "../hooks/use_fetch_api";
import constants from "../config/constants";
import { deptLocalitiesActions } from "../store/dept-localities-slice";
import { HttpStatusCode } from "axios";
import { DepartmentVM } from "../models/department/DepartmentVM";
import { ApiResponse } from "../type";
import api_routes from "../config/api_routes";
import { PoweroffOutlined } from "@ant-design/icons";
import { PersonPlus } from "react-bootstrap-icons";
import { authActions } from "../store/auth-slice";
import { physioFileActions } from "../store/physio-file-slice";
import { modalsShowActions } from "../store/modals-show-slice";
import client_routes from "../config/client_routes";
import localforage from "localforage";
import { useNavigate } from "react-router-dom";
import anephysioLogo from "../assets/anephysio-01-blue.png";

const HomePage: FC = () => {
	const { sendRequest: fetchDepartmentsRequest } = useFetchApi();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);
	const accessToken = useAppSelector(
		(state) => state.authReducer.accessToken
	);
	const currentUser = useAppSelector((state) => state.authReducer.user);

	const handleLogoutClick = () => {
		localforage.clear();
		sessionStorage.clear();
		localStorage.clear();

		dispatch(authActions.resetAllStateToDefaults());
		dispatch(deptLocalitiesActions.resetDepartmentLocaltiesToInitValues());
		dispatch(physioFileActions.resetPhysioFileToInitValues());
		dispatch(modalsShowActions.resetAllStateToDefaults());

		navigate(client_routes.ROUTE_AUTH, { replace: true });
	};

	const handleShowModal = () => {
		setShowModal(true);
	};

	useEffect(() => {
		if (sessionStorage.getItem("canFetchInitialData") === "true") {
			sessionStorage.setItem("canFetchInitialData", "false");
			const fetchData = async () => {
				try {
					const { cleanupFunction } = await fetchDepartmentsRequest(
						{
							url: api_routes.ROUTE_DEPT_GET_ALL,
						},
						(
							departmentResponseData: ApiResponse<DepartmentVM[]>
						) => {
							if (
								departmentResponseData.status !==
								HttpStatusCode.Ok
							) {
								message.error(departmentResponseData.message);
								console.error(
									"There was a error fetching departments"
								);
							} else {
								departmentResponseData.data!.map((dept) => {
									dept.shorthand === constants.JIL_RIJEKA &&
										dispatch(
											deptLocalitiesActions.setJilRijeka(
												dept
											)
										);
									dept.shorthand === constants.JIL_SUSAK &&
										dispatch(
											deptLocalitiesActions.setJilSusak(
												dept
											)
										);
									dept.shorthand === constants.CRC &&
										dispatch(
											deptLocalitiesActions.setCrc(dept)
										);
									dept.shorthand === constants.KARDIO_JIL &&
										dispatch(
											deptLocalitiesActions.setKardioJil(
												dept
											)
										);

									return "done";
								});
							}
						},
						accessToken
					);
					return () => {
						cleanupFunction();
					};
				} catch (error: any) {
					console.error("Error fetching departments:", error);
				}
			};

			fetchData();
		}
	}, [accessToken, dispatch, fetchDepartmentsRequest]);

	return (
		<div className={localStyles.mainContainer}>
			<img
				src={anephysioLogo}
				alt='app logo'
				className={localStyles.logo}
			/>
			{currentUser.role === "admin" && (
				<Tooltip title='Registracija novih korisnika'>
					<Button
						type='text'
						shape='circle'
						icon={<PersonPlus style={{ fontSize: "35px" }} />}
						onClick={() =>
							navigate(client_routes.ROUTE_AUTH_REGISTER)
						}
						style={{
							position: "absolute",
							top: "30px",
							right: "90px",
							width: "50px",
							height: "50px",
							zIndex: 1,
						}}
					/>
				</Tooltip>
			)}
			<Tooltip title='Odjava'>
				<Button
					type='text'
					shape='circle'
					icon={<PoweroffOutlined style={{ fontSize: "30px" }} />}
					onClick={handleShowModal}
					style={{
						position: "absolute",
						top: "30px",
						right: "30px",
						width: "50px",
						height: "50px",
						zIndex: 1,
					}}
				/>
			</Tooltip>
			<Modal
				centered
				open={showModal}
				onOk={handleLogoutClick}
				okText='Odjava'
				okType='danger'
				cancelText='Odustani'
				okButtonProps={{ type: "primary" }}
				onCancel={() => setShowModal(false)}>
				<h2>Potvrda odjave</h2>
				<h3>Želite li se odjaviti?</h3>
			</Modal>
			<Row gutter={120} justify='center'>
				<Col>
					<CustomLink
						label='JIL Rijeka'
						to={client_routes.ROUTE_DEPT_JIL_RIJEKA}
						className={localStyles.departmentButton}
					/>
				</Col>
				<Col>
					<CustomLink
						label='JIL Sušak'
						to={client_routes.ROUTE_DEPT_JIL_SUSAK}
						className={localStyles.departmentButton}
					/>
				</Col>
				<Col>
					<CustomLink
						label='Kardio JIL'
						to={client_routes.ROUTE_DEPT_KARDIO_JIL}
						className={localStyles.departmentButton}
					/>
				</Col>
				<Col>
					<CustomLink
						label='CRC'
						to={client_routes.ROUTE_DEPT_CRC}
						className={localStyles.departmentButton}
					/>
				</Col>
			</Row>
		</div>
	);
};

export default HomePage;
