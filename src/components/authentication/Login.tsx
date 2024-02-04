import { type FC, useEffect, useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import client_routes from "../../config/client_routes";
import api_routes from "../../config/api_routes";
import { authActions } from "../../store/auth-slice";
import { Button, Form, Input } from "antd";
import { useAppDispatch } from "../../hooks/use_app_dispatch";
import { useAppSelector } from "../../hooks/use_app_selector";
import { ApiResponse, LoginRequestData, LoginResponseData } from "../../type";
import useFetchApi from "../../hooks/use_fetch_api";
import { HttpStatusCode } from "axios";

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
		<div className={`${styles.content} ${styles["centered-element"]}`}>
			<Form
				name='login'
				className='login-form'
				onFinish={onSubmit}
				data-testid='loginForm'>
				<h1>Prijava</h1>
				<p className={styles["lighter-text"]}>
					Upišite podatke za prijavu da bi nastavili
				</p>
				{!loginValid && (
					<p className={styles["error-text"]}>{loginErrorMessage}</p>
				)}
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
					/>
				</Form.Item>
				<Form.Item>
					<Button
						type='text'
						shape='round'
						size='large'
						htmlType='submit'
						data-testid='loginButton'
						className={styles["btn-rounded-dark"]}>
						Prijava
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default Login;
