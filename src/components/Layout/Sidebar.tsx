import React from "react";
import { PoweroffOutlined } from "@ant-design/icons";
import client_routes, { sideBarKey } from "../../config/client_routes";
import { NavLink } from "react-router-dom";
import Sider from "antd/es/layout/Sider";
import { Menu } from "antd";

export const Sidebar: React.FC = () => {
	const sideBarItems = [
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
			<Sider collapsible width={200} style={{ overflowY: "scroll" }}>
				<Menu
					theme='dark'
					mode='inline'
					style={{ height: "100%" }}
					items={sideBarItems}
				/>
			</Sider>
		</>
	);
};
