import { useState, type FC } from "react";
import { PoweroffOutlined, HomeOutlined } from "@ant-design/icons";
import client_routes, { sideBarKey } from "../../config/client_routes";
import { NavLink, useNavigate } from "react-router-dom";
import { Heart, Hospital, PersonPlus, Virus } from "react-bootstrap-icons";
import { ItemType, MenuItemType } from "antd/es/menu/hooks/useItems";
import Sider from "antd/es/layout/Sider";
import { Menu, Modal, Tooltip } from "antd";
import localforage from "localforage";
import { authActions } from "../../store/auth-slice";
import { useAppDispatch } from "../../hooks/use_app_dispatch";
import { deptLocalitiesActions } from "../../store/dept-localities-slice";
import { physioFileActions } from "../../store/physio-file-slice";
import { modalsShowActions } from "../../store/modals-show-slice";
import { useAppSelector } from "../../hooks/use_app_selector";

export const MainLayoutSidebar: FC = () => {
	const [showModal, setShowModal] = useState(false);
	const currentUser = useAppSelector((state) => state.authReducer.user);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

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

	const sideBarItems: ItemType<MenuItemType>[] = [
		{
			key: sideBarKey.Home,
			icon: <HomeOutlined />,
			label: <NavLink to={client_routes.ROUTE_HOME}>Početna</NavLink>,
		},
		{
			key: sideBarKey.JilRijeka,
			icon: <Hospital />,
			label: (
				<NavLink to={client_routes.ROUTE_DEPT_JIL_RIJEKA}>
					JIL Rijeka
				</NavLink>
			),
		},
		{
			key: sideBarKey.CRC,
			icon: <Virus />,
			label: <NavLink to={client_routes.ROUTE_DEPT_CRC}>CRC</NavLink>,
		},
		{
			key: sideBarKey.JilSusak,
			icon: <Hospital />,
			label: (
				<NavLink to={client_routes.ROUTE_DEPT_JIL_SUSAK}>
					JIL Sušak
				</NavLink>
			),
		},
		{
			key: sideBarKey.KardioJil,
			icon: <Heart />,
			label: (
				<NavLink to={client_routes.ROUTE_DEPT_KARDIO_JIL}>
					Kardio JIL
				</NavLink>
			),
		},
		{
			key: sideBarKey.RegisterNewUser,
			icon: <PersonPlus />,
			disabled: currentUser.role !== "admin",
			label:
				currentUser.role === "admin" ? (
					<NavLink to={client_routes.ROUTE_AUTH_REGISTER}>
						Registracija
					</NavLink>
				) : (
					<Tooltip title='Samo administrator može registrirati novog korisnika'>
						<span>Registracija</span>
					</Tooltip>
				),
		},
		{
			key: sideBarKey.LogOut,
			icon: <PoweroffOutlined />,
			onClick: handleShowModal,
			label: <p>Odjava</p>,
		},
	];

	return (
		<>
			<Sider width={"auto"}>
				<Menu theme='dark' mode='inline' items={sideBarItems} />
				<Modal
					centered
					open={showModal}
					onOk={handleLogoutClick}
					okText='Odjava'
					okType='danger'
					cancelText='Odustani'
					okButtonProps={{ type: "primary" }}
					onCancel={() => setShowModal(false)}>
					<h1>Potvrda odjave</h1>
					<h2>Želite li se odjaviti?</h2>
				</Modal>
			</Sider>
		</>
	);
};
