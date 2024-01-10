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

type PhysioFileLayoutProps = PropsWithChildren;

const PhysioFileLayout: FC<PhysioFileLayoutProps> = ({
	children,
}: PhysioFileLayoutProps) => {
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
		<div className={styles.layoutcontainer}>
			<Layout>
				<Sider
					width={"131.11px"}
					className={styles.mainsidebar}
					style={{ position: "fixed" }}>
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
				{children}
			</Layout>
		</div>
	);
};

export default PhysioFileLayout;