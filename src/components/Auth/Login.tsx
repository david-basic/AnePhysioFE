import { type FC, useEffect, useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import styles from "./Login.module.css";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";
import useHttp from "../../hooks/use_http";
import client_routes from "../../config/client_routes";
import api_routes from "../../config/api_routes";
import { authActions } from "../../store/auth-slice";
import localforage from "localforage";
import { Button, Form, Input } from "antd";

const Login: FC = () => {
	const [loginValid, setLoginValid] = useState(true);
	const [loginErrorMessage, setLoginErrorMessage] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { sendRequest: sendLoginRequest } = useHttp();
	const isLoggedIn: boolean = useSelector(
		(state: RootState) => state.auth.isLoggedIn
	);

	useEffect(() => {
		if (isLoggedIn) {
			navigate(client_routes.ROUTE_HOME, { replace: true });
		}
	}, [isLoggedIn, navigate]);

	const onSubmit = (values: LoginRequestData) => {
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
			manageLoginResponseData.bind(null, userData.username)
		);

		function manageLoginResponseData(
			username: string,
			loginResponse: ApiLoginResponse
		) {
			if (loginResponse.status !== 200) {
				setLoginValid(false);
				setLoginErrorMessage(loginResponse.message);

				dispatch(authActions.setIsLoggedIn(false));
				localforage.setItem<boolean>("isLoggedIn", false);
			} else {
				dispatch(authActions.setUsername(username));
				localforage.setItem<string>("username", username);

				dispatch(authActions.setIsLoggedIn(true));
				localforage.setItem<boolean>("isLoggedIn", true);

				dispatch(
					authActions.setAccessToken(loginResponse.data.accessToken)
				);
				localforage.setItem<string>(
					"accessToken",
					loginResponse.data.accessToken
				);

				dispatch(
					authActions.setRefreshToken(loginResponse.data.refreshToken)
				);
				localforage.setItem<string>(
					"refreshToken",
					loginResponse.data.refreshToken
				);

				dispatch(
					authActions.setTokenType(loginResponse.data.tokenType)
				);
				localforage.setItem<string>(
					"tokenType",
					loginResponse.data.tokenType
				);

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
				<h1>Log in</h1>
				<p className={styles["lighter-text"]}>
					Enter your data to continue
				</p>
				{!loginValid && (
					<p className={styles["error-text"]}>{loginErrorMessage}</p>
				)}
				<Form.Item
					name='username'
					rules={[
						{
							required: true,
							message: "Please input username!",
						},
					]}>
					<Input
						data-testid='usernameInput'
						suffix={
							<UserOutlined className='site-form-item-icon' />
						}
						placeholder='Username'
					/>
				</Form.Item>
				<Form.Item
					name='password'
					rules={[
						{
							required: true,
							message: "Please input password!",
						},
					]}>
					<Input
						data-testid='passwordInput'
						suffix={
							<LockOutlined className='site-form-item-icon' />
						}
						type='password'
						placeholder='Password'
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
						Sign in
					</Button>
				</Form.Item>
				<p className={styles["lighter-text"]}>
					I do not have an account.{" "}
					<NavLink
						className={styles["link-text"]}
						to={client_routes.ROUTE_AUTH_REGISTER}
						replace={true}>
						Register.
					</NavLink>
				</p>
			</Form>
		</div>
	);
};

export default Login;
