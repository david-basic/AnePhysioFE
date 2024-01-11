import { type FC, PropsWithChildren, useState } from "react";
import { useAppDispatch } from "../../hooks/use_app_dispatch";
import { NavLink, useNavigate } from "react-router-dom";
import localforage from "localforage";
import { authActions } from "../../store/auth-slice";
import { deptLocalitiesActions } from "../../store/dept-localities-slice";
import { physioFileActions } from "../../store/physio-file-slice";
import client_routes, { sideBarKey } from "../../config/client_routes";
import { ItemType, MenuItemType } from "antd/es/menu/hooks/useItems";
import { PoweroffOutlined, HomeOutlined } from "@ant-design/icons";
import { Heart, Hospital, Virus } from "react-bootstrap-icons";
import { Layout, Menu, Modal } from "antd";
import Sider from "antd/es/layout/Sider";
import styles from "./PhysioFileLayout.module.css";
import { modalsShowActions } from "../../store/modals-show-slice";
import { useAppSelector } from "../../hooks/use_app_selector";
import ConfirmLeavePhysioFileModal from "../modals/ConfirmLeavePhysioFileModal";

type PhysioFileLayoutProps = PropsWithChildren;

const PhysioFileLayout: FC<PhysioFileLayoutProps> = ({
	children,
}: PhysioFileLayoutProps) => {
	const [showModal, setShowModal] = useState(false);
	const [navigateToRoute, setNavigateToRoute] = useState<
		string | undefined
	>();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const dataSaved = useAppSelector(
		(state) => state.physioFileReducer.dataSaved
	);
	const showLeaveModal = useAppSelector(
		(state) => state.modalsShowReducer.showLeaveModal
	);

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
		if (!dataSaved) {
			setNavigateToRoute(client_routes.ROUTE_HOME);
			dispatch(modalsShowActions.setShowLeaveModal(true));
		} else {
			setShowModal(true);
		}
	};

	const sideBarItems: ItemType<MenuItemType>[] = [
		{
			key: sideBarKey.Home,
			icon: <HomeOutlined />,
			label: (
				<NavLink
					to={client_routes.ROUTE_HOME}
					onClick={(event) => {
						if (!dataSaved) {
							event.preventDefault();
							setNavigateToRoute(client_routes.ROUTE_HOME);
							dispatch(modalsShowActions.setShowLeaveModal(true));
						}
					}}>
					Home
				</NavLink>
			),
		},
		{
			key: sideBarKey.JilRijeka,
			icon: <Hospital />,
			label: (
				<NavLink
					to={client_routes.ROUTE_DEPT_JIL_RIJEKA}
					onClick={(event) => {
						if (!dataSaved) {
							event.preventDefault();
							setNavigateToRoute(
								client_routes.ROUTE_DEPT_JIL_RIJEKA
							);
							dispatch(modalsShowActions.setShowLeaveModal(true));
						}
					}}>
					JIL Rijeka
				</NavLink>
			),
		},
		{
			key: sideBarKey.CRC,
			icon: <Virus />,
			label: (
				<NavLink
					to={client_routes.ROUTE_DEPT_CRC}
					onClick={(event) => {
						if (!dataSaved) {
							event.preventDefault();
							setNavigateToRoute(client_routes.ROUTE_DEPT_CRC);
							dispatch(modalsShowActions.setShowLeaveModal(true));
						}
					}}>
					CRC
				</NavLink>
			),
		},
		{
			key: sideBarKey.JilSusak,
			icon: <Hospital />,
			label: (
				<NavLink
					to={client_routes.ROUTE_DEPT_JIL_SUSAK}
					onClick={(event) => {
						if (!dataSaved) {
							event.preventDefault();
							setNavigateToRoute(
								client_routes.ROUTE_DEPT_JIL_SUSAK
							);
							dispatch(modalsShowActions.setShowLeaveModal(true));
						}
					}}>
					JIL Sušak
				</NavLink>
			),
		},
		{
			key: sideBarKey.KardioJil,
			icon: <Heart />,
			label: (
				<NavLink
					to={client_routes.ROUTE_DEPT_KARDIO_JIL}
					onClick={(event) => {
						if (!dataSaved) {
							event.preventDefault();
							setNavigateToRoute(
								client_routes.ROUTE_DEPT_KARDIO_JIL
							);
							dispatch(modalsShowActions.setShowLeaveModal(true));
						}
					}}>
					Kardio JIL
				</NavLink>
			),
		},
		{
			key: sideBarKey.LogOut,
			icon: <PoweroffOutlined />,
			onClick: handleShowModal,
			label: <p>Log out</p>,
		},
	];

	return (
		<div className={styles.layoutcontainer}>
			<Layout>
				<Sider
					width={"131.11px"}
					className={styles.mainsidebar}
					style={{ position: "fixed" }}>
					<Menu theme='dark' mode='inline' items={sideBarItems} />
					<Modal
						title='Potvrda odjave'
						centered
						open={showModal}
						onOk={handleLogoutClick}
						okText='Odjava'
						cancelText='Odustani'
						okType='danger'
						okButtonProps={{ type: "primary" }}
						onCancel={() => setShowModal(false)}>
						<h2>Želite li se odjaviti?</h2>
					</Modal>
					<ConfirmLeavePhysioFileModal
						navigateTo={navigateToRoute}
						showLeaveModal={showLeaveModal}
					/>
				</Sider>
				{children}
			</Layout>
		</div>
	);
};

export default PhysioFileLayout;
