import { type FC } from "react";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Header } from "antd/es/layout/layout";
import { Row } from "antd";
import { Link } from "react-router-dom";
import client_routes from "../../config/client_routes";

export const HeaderBar: FC = () => {
	const username = useSelector((state: RootState) => state.auth.username);

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
