import { type FC, useEffect, useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import localStyles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import client_routes from "../../config/client_routes";
import api_routes from "../../config/api_routes";
import { authActions } from "../../store/auth-slice";
import { Button, Flex, Form, Input, Layout, Row, Space, Tooltip } from "antd";
import { useAppDispatch } from "../../hooks/use_app_dispatch";
import { useAppSelector } from "../../hooks/use_app_selector";
import { ApiResponse, LoginRequestData, LoginResponseData } from "../../type";
import useFetchApi from "../../hooks/use_fetch_api";
import { HttpStatusCode } from "axios";
import { Content, Footer } from "antd/es/layout/layout";
import { CopyrightOutlined } from "@ant-design/icons";
import { ArrowLeft } from "react-bootstrap-icons";
import anephysioLogo from "../../assets/anephysio-01-blue.png";

const Login: FC = () => {
	const [loginValid, setLoginValid] = useState(true);
	const [loginErrorMessage, setLoginErrorMessage] = useState("");
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const isLoggedIn = useAppSelector((state) => state.authReducer.isLoggedIn);
	const { sendRequest: sendLoginRequest, isLoading } = useFetchApi();

	useEffect(() => {
		if (isLoggedIn) {
			navigate(client_routes.ROUTE_HOME, { replace: true });
		}
	}, [isLoggedIn, navigate]);

	const onSubmit = async (values: LoginRequestData) => {
		if (isLoading) {
			return;
		}

		const userData = {
			username: values.username,
			password: values.password,
		};

		sendLoginRequest(
			{
				url: api_routes.ROUTE_AUTH_LOGIN,
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: userData,
			},
			manageLoginResponseData.bind(null, userData.username),
			""
		);

		function manageLoginResponseData(
			username: string,
			loginResponse: ApiResponse<LoginResponseData>
		) {
			if (loginResponse.status !== HttpStatusCode.Ok) {
				setLoginValid(false);
				setLoginErrorMessage(loginResponse.message);

				dispatch(authActions.setIsLoggedIn(false));
			} else {
				dispatch(authActions.setUsername(username));
				dispatch(authActions.setIsLoggedIn(true));
				dispatch(
					authActions.setAccessToken(loginResponse.data!.accessToken)
				);
				dispatch(
					authActions.setRefreshToken(
						loginResponse.data!.refreshToken
					)
				);
				dispatch(
					authActions.setTokenType(loginResponse.data!.tokenType)
				);
				dispatch(authActions.setUser(loginResponse.data!.user));

				dispatch(authActions.setTokenIsValid(true));

				sessionStorage.setItem("canFetchInitialData", "true");

				navigate(client_routes.ROUTE_HOME, { replace: true });
			}
		}
	};

	return (
		<Layout className={localStyles.page}>
			<Tooltip title='Return'>
				<Button
					type='text'
					shape='circle'
					icon={
						<ArrowLeft
							style={{ fontSize: "30px", marginTop: "5px" }}
						/>
					}
					onClick={() => navigate(-1)}
					style={{
						position: "absolute",
						top: "30px",
						left: "30px",
						width: "50px",
						height: "50px",
						zIndex: 1,
					}}
				/>
			</Tooltip>
			<span
				style={{
					position: "absolute",
					top: "50px",
					right: "100px",
					width: "50px",
					height: "50px",
					zIndex: 1,
				}}>
				<img
					src={anephysioLogo}
					alt='app logo'
					className={localStyles.logo}
				/>
			</span>
			<Content className={localStyles.content}>
				<Space
					direction='vertical'
					align='center'
					className={localStyles.content}>
					<Row align={"middle"} className={localStyles.title}>
						<h3>Prijava</h3>
					</Row>
					<Row>
						<Form
							name='login'
							onFinish={onSubmit}
							data-testid='loginForm'
							className={localStyles.form}>
							<Flex vertical justify='center' align='center'>
								<span className={localStyles.informationText}>
									Upišite podatke za prijavu da bi nastavili
								</span>
								{!loginValid && (
									<span className={localStyles.errorText}>
										{loginErrorMessage}
									</span>
								)}
							</Flex>
							<Form.Item
								name='username'
								rules={[
									{
										required: true,
										message: "Unesite korisničko ime!",
									},
								]}>
								<Input
									data-testid='usernameInput'
									suffix={
										<UserOutlined className='site-form-item-icon' />
									}
									placeholder='Korisničko ime'
									className={localStyles.usernameInput}
								/>
							</Form.Item>
							<Form.Item
								name='password'
								rules={[
									{
										required: true,
										message: "Unesite zaporku!",
									},
								]}>
								<Input
									data-testid='passwordInput'
									suffix={
										<LockOutlined className='site-form-item-icon' />
									}
									type='password'
									placeholder='Zaporka'
									className={localStyles.passwordInput}
								/>
							</Form.Item>
							<Form.Item>
								<Button
									type='text'
									shape='round'
									size='large'
									htmlType='submit'
									data-testid='loginButton'
									className={localStyles.btnRoundedLight}>
									PRIJAVI SE
								</Button>
							</Form.Item>
						</Form>
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

export default Login;

/*


		<div className={`${styles.content} ${styles["centered-element"]}`}>
			
		</div>

*/
