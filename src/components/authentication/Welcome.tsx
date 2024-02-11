import { type FC, useEffect } from "react";
import localStyles from "./Welcome.module.css";
import { Button, Layout, Row, Space } from "antd";
import { useNavigate } from "react-router-dom";
import client_routes from "../../config/client_routes";
import { useAppSelector } from "../../hooks/use_app_selector";
import anephysioLogo from "../../assets/anephysio-01-blue.png";
import { CopyrightOutlined } from "@ant-design/icons";
import { Content, Footer } from "antd/es/layout/layout";

const Welcome: FC = () => {
	const navigate = useNavigate();
	const isLoggedIn = useAppSelector((state) => state.authReducer.isLoggedIn);

	useEffect(() => {
		if (isLoggedIn) {
			navigate(client_routes.ROUTE_HOME, { replace: true });
		}
	}, [isLoggedIn, navigate]);

	return (
		<Layout className={localStyles.page}>
			<Content className={localStyles.content}>
				<Space
					direction='vertical'
					align='center'
					className={localStyles.content}>
					<Row
						align={"middle"}
						className={localStyles.logoAndTitleContainer}>
						<img
							src={anephysioLogo}
							alt='app logo'
							className={localStyles.logo}
						/>
						<h3 className={localStyles.title}>AnePhysio</h3>
					</Row>
					<Row>
						<Button
							className={localStyles.btnRoundedLight}
							type='text'
							shape='round'
							size='large'
							onClick={() =>
								navigate(client_routes.ROUTE_AUTH_LOGIN)
							}>
							PRIJAVA
						</Button>
					</Row>
				</Space>
			</Content>
			<Footer className={localStyles.footer}>
				<Row
					justify={"center"}
					align={"bottom"}
					className={localStyles.authorDescription}>
					<span>
						<CopyrightOutlined /> David Bašić
					</span>
				</Row>
			</Footer>
		</Layout>
	);
};

export default Welcome;
