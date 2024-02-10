import { type FC, useRef, useState } from "react";
import styles from "./Register.module.css";
import { LockOutlined, IdcardOutlined, UserOutlined } from "@ant-design/icons";
import {
	Button,
	Checkbox,
	Form,
	Input,
	InputRef,
	Select,
	RefSelectProps,
} from "antd";
import { useNavigate } from "react-router-dom";
import client_routes from "../../config/client_routes";
import api_routes from "../../config/api_routes";
import { ApiRegisterResponse, RegisterRequestData } from "../../type";
import useFetchApi from "../../hooks/use_fetch_api";
import { HttpStatusCode } from "axios";
import { Mortarboard } from "react-bootstrap-icons";

const { Option } = Select;

const Register: FC = () => {
	const navigate = useNavigate();
	const { sendRequest: sendRegisterRequest, isLoading } = useFetchApi();
	const [registerErrorMessage, setRegisterErrorMessage] = useState("");
	const [registerSuccessMessage, setRegisterSuccessMessage] = useState("");

	const firstNameRef = useRef<InputRef>(null);
	const lastNameRef = useRef<InputRef>(null);
	const titleRef = useRef<InputRef>(null);
	const sexRef = useRef<RefSelectProps>(null);
	const usernameRef = useRef<InputRef>(null);
	const passwordRef = useRef<InputRef>(null);

	const onFinish = (values: RegisterRequestData) => {
		if (isLoading) {
			return;
		}

		const registerUserInputData = {
			firstName: values.firstname,
			lastName: values.lastname,
			sex: values.sex,
			title: values.title,
			username: values.username,
			password: values.password,
		};

		const manageRegisterResponseData = (
			registerResponseData: ApiRegisterResponse
		) => {
			if (registerResponseData.status !== HttpStatusCode.Created) {
				console.error("There was response error");
				setRegisterErrorMessage(registerResponseData.message);
				setRegisterSuccessMessage("");
			} else {
				setRegisterErrorMessage("");
				setRegisterSuccessMessage(registerResponseData.message);
				navigate(client_routes.ROUTE_AUTH_REGISTER, { replace: true });
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
			manageRegisterResponseData.bind(null),
			""
		);
	};

	return (
		<div className={`${styles.content} ${styles["centered-element"]}`}>
			<Form
				name='register'
				initialValues={{ remember: false }}
				className={styles["register-form"]}
				onFinish={onFinish}>
				<h1>Registracija</h1>
				<p className={styles["lighter-text"]}>
					Unesite podatke novog korisnika za nastavak
				</p>
				{registerErrorMessage !== "" && (
					<p className={styles["error-text"]}>
						{registerErrorMessage}
					</p>
				)}
				{registerSuccessMessage !== "" && (
					<p className={styles["success-text"]}>
						{registerSuccessMessage}
					</p>
				)}
				<Form.Item
					name='firstname'
					rules={[
						{
							required: true,
							message: "Molimo vas unesite ime!",
						},
					]}>
					<Input
						suffix={<IdcardOutlined />}
						placeholder='Ime'
						ref={firstNameRef}
					/>
				</Form.Item>
				<Form.Item
					name='lastname'
					rules={[
						{
							required: true,
							message: "Molimo vas unesite prezime!",
						},
					]}>
					<Input
						suffix={<IdcardOutlined />}
						placeholder='Prezime'
						ref={lastNameRef}
					/>
				</Form.Item>
				<Form.Item
					name='title'
					rules={[
						{
							required: true,
							message: "Molimo vas unesite titulu!",
						},
					]}>
					<Input
						suffix={<Mortarboard />}
						placeholder='Titula'
						ref={titleRef}
					/>
				</Form.Item>
				<Form.Item
					name='sex'
					rules={[
						{ required: true, message: "Molimo odaberite spol!" },
					]}>
					<Select placeholder='Spol' allowClear ref={sexRef}>
						<Option value='male'>Muški</Option>
						<Option value='female'>Ženski</Option>
					</Select>
				</Form.Item>
				<Form.Item
					name='username'
					rules={[
						{
							required: true,
							message: "Molimo vas unesite korisničko ime!",
						},
						({ getFieldValue }) => ({
							validator(_) {
								if (getFieldValue("username").length >= 4) {
									return Promise.resolve();
								}
								return Promise.reject(
									new Error(
										"Duljina korisničkog imena mora biti barem 5 znakova!"
									)
								);
							},
						}),
					]}>
					<Input
						suffix={<UserOutlined />}
						placeholder='Korisničko ime'
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
								"Zaporka se mora sastojati od barem 1 broja, 1 malog, velikog slova i 1 specijalnog znaka i ne smije sadržavati razmake!",
						},
					]}>
					<Input
						suffix={<LockOutlined />}
						type='password'
						placeholder='Zaporka'
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
							message: "Molimo vas potvrdite zaporku!",
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
									new Error("Zaporke nisu jednake!")
								);
							},
						}),
					]}>
					<Input.Password placeholder='Potvrda zaporke' />
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
											"Za nastavak potvrdite pravila korištenja i politiku privatnosti!"
										)
									);
								},
							}),
						]}>
						<Checkbox name='accept' id='tos-checkbox'>
							Prihvaćam pravila korištenja i politiku privatnosti!
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
						Registriraj korisnika
					</Button>
				</Form.Item>
				{/* <p className={styles["lighter-text"]}>
					Već ste registrirani?{" "}
					<NavLink className={styles["link-text"]} to='/auth/login'>
						Prijava.
					</NavLink>
				</p> */}
			</Form>
		</div>
	);
};

export default Register;
