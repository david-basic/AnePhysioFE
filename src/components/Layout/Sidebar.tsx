import { type FC } from "react";
import { PoweroffOutlined, HomeOutlined } from "@ant-design/icons";
import client_routes, { sideBarKey } from "../../config/client_routes";
import { NavLink } from "react-router-dom";
import Sider from "antd/es/layout/Sider";
import { Menu } from "antd";
import { Heart, Hospital, Virus } from "react-bootstrap-icons";

export const Sidebar: FC = () => {
	const sideBarItems = [
		{
			key: sideBarKey.Home,
			icon: <HomeOutlined />,
			label: <NavLink to={client_routes.ROUTE_HOME}>Home</NavLink>,
		},
		{
			key: sideBarKey.JilRijeka,
			icon: <Hospital />,
			label: (
				<NavLink to={client_routes.ROUTE_DEPT_JIL_RIJEKA}>JIL Rijeka</NavLink>
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
				<NavLink to={client_routes.ROUTE_DEPT_JIL_SUSAK}>JIL Sušak</NavLink>
			),
		},
		{
			key: sideBarKey.KardioJil,
			icon: <Heart />,
			label: (
				<NavLink to={client_routes.ROUTE_DEPT_KARDIO_JIL}>Kardio JIL</NavLink>
			),
		},
		{
			key: sideBarKey.LogOut,
			icon: <PoweroffOutlined />,
			label: (
				<NavLink to={client_routes.ROUTE_AUTH_LOGOUT}>Log out</NavLink>
			),
		},
	];

	return (
		<>
			<Sider
				width={"auto"}>
				<Menu theme='dark' mode='inline' items={sideBarItems} />
			</Sider>
		</>
	);
};
