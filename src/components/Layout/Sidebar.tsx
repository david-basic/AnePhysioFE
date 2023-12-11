import { type FC } from "react";
import { PoweroffOutlined, HomeOutlined } from "@ant-design/icons";
import client_routes, { sideBarKey } from "../../config/client_routes";
import { Link, NavLink } from "react-router-dom";
import Sider from "antd/es/layout/Sider";
import { Menu } from "antd";
import { Heart, Hospital, Virus } from "react-bootstrap-icons";

export const Sidebar: FC = () => {
	const sideBarItems = [
		{
			key: sideBarKey.Home,
			icon: <HomeOutlined />,
			label: <Link to={client_routes.ROUTE_HOME}>Home</Link>,
		},
		{
			key: sideBarKey.JilRijeka,
			icon: <Hospital />,
			label: (
				<Link to={client_routes.ROUTE_DEPT_JIL_RIJEKA}>JIL Rijeka</Link>
			),
		},
		{
			key: sideBarKey.CRC,
			icon: <Virus />,
			label: <Link to={client_routes.ROUTE_DEPT_CRC}>CRC</Link>,
		},
		{
			key: sideBarKey.JilSusak,
			icon: <Hospital />,
			label: (
				<Link to={client_routes.ROUTE_DEPT_JIL_SUSAK}>JIL Sušak</Link>
			),
		},
		{
			key: sideBarKey.KardioJil,
			icon: <Heart />,
			label: (
				<Link to={client_routes.ROUTE_DEPT_KARDIO_JIL}>Kardio JIL</Link>
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
				collapsible
				defaultCollapsed
				width={200}
				style={{ overflowY: "hidden" }}>
				<Menu theme='dark' mode='inline' items={sideBarItems} />
			</Sider>
		</>
	);
};
