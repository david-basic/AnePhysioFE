import { FC, useRef, useState } from "react";
import styles from "./Register.module.css";
import { LockOutlined, IdcardOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, InputRef } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import useHttp from "../../hooks/use_http";
import client_routes from "../../config/client_routes";
import api_routes from "../../config/api_routes";

const Register: FC = () => {
	const navigate = useNavigate();
	const { sendRequest: sendRegisterRequest } = useHttp();
	const [registerErrorMessage, setRegisterErrorMessage] = useState("");

	const firstNameRef = useRef<InputRef>(null);
	const lastNameRef = useRef<InputRef>(null);
	const usernameRef = useRef<InputRef>(null);
	const passwordRef = useRef<InputRef>(null);

	const onFinish = (values: any) => {
		const registerUserInputData = {
			firstName: values.firstname,
			lastName: values.lastname,
			username: values.username,
			password: values.password,
		};

		const manageRegisterResponseData = (registerResponseData: any) => {
			if (registerResponseData.success === undefined) {
				console.log("There was response error");
				setRegisterErrorMessage(registerResponseData.message);
			} else {
				setRegisterErrorMessage("");

				navigate(client_routes.ROUTE_HOME, { replace: true });
			}
		};

		sendRegisterRequest(
			{
				url: api_routes.ROUTE_AUTH_REGISTER,
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: registerUserInputData,
			},
			manageRegisterResponseData.bind(null)
		);
	};

	return (
		<div className={`${styles.content} ${styles["centered-element"]}`}>
			<Form
				name='register'
				initialValues={{ remember: false }}
				className={styles["register-form"]}
				onFinish={onFinish}>
				<h1>Registration</h1>
				<p className={styles["lighter-text"]}>
					Input your data to continue
				</p>
				{registerErrorMessage !== "" && (
					<p className={styles["error-text"]}>
						{registerErrorMessage}
					</p>
				)}
				<Form.Item
					name='firstname'
					rules={[
						{
							required: true,
							message: "Please input your first name!",
						},
					]}>
					<Input
						suffix={<IdcardOutlined />}
						placeholder='First name'
						ref={firstNameRef}
					/>
				</Form.Item>
				<Form.Item
					name='lastname'
					rules={[
						{
							required: true,
							message: "Please input your last name!",
						},
					]}>
					<Input
						suffix={<IdcardOutlined />}
						placeholder='Last name'
						ref={lastNameRef}
					/>
				</Form.Item>
				<Form.Item
					name='username'
					rules={[
						{
							required: true,
							message: "Please input your username!",
						},
						({ getFieldValue }) => ({
							validator(_) {
								if (getFieldValue("username").length >= 4) {
									return Promise.resolve();
								}
								return Promise.reject(
									new Error(
										"Username length must be at least 5 charachters"
									)
								);
							},
						}),
					]}>
					<Input
						suffix={<UserOutlined />}
						placeholder='Username'
						ref={usernameRef}
					/>
				</Form.Item>
				<Form.Item
					name='password'
					hasFeedback
					rules={[
						{
							required: true,
							pattern: new RegExp(
								"^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,255}$"
							),
							message:
								"Password must contain at least 1 number, 1 lowercase, 1 uppercase and 1 special character and it must not contain spaces.",
						},
					]}>
					<Input
						suffix={<LockOutlined />}
						type='password'
						placeholder='Password'
						ref={passwordRef}
					/>
				</Form.Item>
				<Form.Item
					name='confirmPassword'
					dependencies={["password"]}
					hasFeedback
					rules={[
						{
							required: true,
							message: "Please confirm the password!",
						},
						({ getFieldValue }) => ({
							validator(_, value) {
								if (
									!value ||
									getFieldValue("password") === value
								) {
									return Promise.resolve();
								}
								return Promise.reject(
									new Error("Passwords do not match!")
								);
							},
						}),
					]}>
					<Input.Password placeholder='Confirm password' />
				</Form.Item>
				<Form.Item>
					<Form.Item
						name='accept'
						valuePropName='checked'
						rules={[
							{
								required: true,
								message: "",
							},
							() => ({
								validator(_) {
									if (
										document.querySelector(
											"#tos-checkbox:checked"
										) !== null
									) {
										return Promise.resolve();
									}
									return Promise.reject(
										new Error(
											"To continue please accept TOS and privacy policy"
										)
									);
								},
							}),
						]}>
						<Checkbox name='accept' id='tos-checkbox'>
							I accept TOS and Privacy policy.
						</Checkbox>
					</Form.Item>
				</Form.Item>
				<Form.Item>
					<Button
						type='text'
						shape='round'
						size='large'
						htmlType='submit'
						className={styles["btn-rounded-dark"]}>
						Register
					</Button>
				</Form.Item>
				<p className={styles["lighter-text"]}>
					Already registered?{" "}
					<NavLink className={styles["link-text"]} to='/auth/login'>
						Log in.
					</NavLink>
				</p>
			</Form>
		</div>
	);
};

export default Register;
