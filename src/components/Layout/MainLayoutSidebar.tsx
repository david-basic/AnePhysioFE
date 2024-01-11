import { useState, type FC } from "react";
import { PoweroffOutlined, HomeOutlined } from "@ant-design/icons";
import client_routes, { sideBarKey } from "../../config/client_routes";
import { NavLink, useNavigate } from "react-router-dom";
import { Heart, Hospital, Virus } from "react-bootstrap-icons";
import { ItemType, MenuItemType } from "antd/es/menu/hooks/useItems";
import Sider from "antd/es/layout/Sider";
import { Menu, Modal } from "antd";
import localforage from "localforage";
import { authActions } from "../../store/auth-slice";
import { useAppDispatch } from "../../hooks/use_app_dispatch";
import { deptLocalitiesActions } from "../../store/dept-localities-slice";
import { physioFileActions } from "../../store/physio-file-slice";
import { modalsShowActions } from "../../store/modals-show-slice";

export const MainLayoutSidebar: FC = () => {
	const [showModal, setShowModal] = useState(false);
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
			label: <NavLink to={client_routes.ROUTE_HOME}>Home</NavLink>,
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
			key: sideBarKey.LogOut,
			icon: <PoweroffOutlined />,
			onClick: handleShowModal,
			label: <p>Log out</p>,
		},
	];

	return (
		<>
			<Sider width={"auto"}>
				<Menu theme='dark' mode='inline' items={sideBarItems} />
				<Modal
					title='Log out confirmation'
					centered
					open={showModal}
					onOk={handleLogoutClick}
					okText='Log out'
					okType='danger'
					okButtonProps={{ type: "primary" }}
					onCancel={() => setShowModal(false)}>
					<h2>Do you want to log out?</h2>
				</Modal>
			</Sider>
		</>
	);
};
