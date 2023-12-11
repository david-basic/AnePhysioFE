import { type FC } from "react";
import { PoweroffOutlined, HomeOutlined } from "@ant-design/icons";
import client_routes, { sideBarKey } from "../../config/client_routes";
import { Link, NavLink } from "react-router-dom";
import Sider from "antd/es/layout/Sider";
import { Menu } from "antd";

export const Sidebar: FC = () => {
	const sideBarItems = [
		{
			key: sideBarKey.Home,
			icon: <HomeOutlined />,
			label: <Link to={client_routes.ROUTE_HOME}>Home</Link>,
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
