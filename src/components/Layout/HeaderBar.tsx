import { type FC } from "react";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import { Row } from "antd";
import { Link } from "react-router-dom";
import client_routes from "../../config/client_routes";
import { useAppSelector } from "../../hooks/use_app_selector";

/**
 * A header bar component with a Home button and a username of the currently logged in user displayed
 * Do not delete. Used as a reminder on how to best show the username of a user.
 * @deprecated
 */
export const HeaderBar: FC = () => {
	const username = useAppSelector((state) => state.auth.username);

	return (
		<Header>
			<Row className='header'>
				<div style={{ marginLeft: "10px" }}>
					<Link to={client_routes.ROUTE_HOME}>
						<HomeOutlined />
					</Link>
				</div>
				<div
					style={{
						display: "flex",
						height: "64px",
						alignItems: "center",
					}}>
					<Link
						to={client_routes.ROUTE_USER_ABOUT}
						style={{ color: "white" }}>
						<UserOutlined style={{ marginRight: "7.5px" }} />
						{username.toUpperCase()}
					</Link>
				</div>
			</Row>
		</Header>
	);
};

export default HeaderBar;
