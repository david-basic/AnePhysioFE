import { type FC, useRef, useState } from "react";
import localStyles from "./Register.module.css";
import {
	LockOutlined,
	IdcardOutlined,
	UserOutlined,
	CopyrightOutlined,
} from "@ant-design/icons";
import {
	Button,
	Checkbox,
	Form,
	Input,
	InputRef,
	Select,
	RefSelectProps,
	Layout,
	Space,
	Row,
	Flex,
	message,
} from "antd";
import { useNavigate } from "react-router-dom";
import client_routes from "../../config/client_routes";
import api_routes from "../../config/api_routes";
import { ApiRegisterResponse, RegisterRequestData } from "../../type";
import useFetchApi from "../../hooks/use_fetch_api";
import { HttpStatusCode } from "axios";
import { Mortarboard } from "react-bootstrap-icons";
import { Content, Footer } from "antd/es/layout/layout";

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
				message.success(registerResponseData.message);
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
		<Layout className={localStyles.page}>
			<Content className={localStyles.content}>
				<Space
					direction='vertical'
					align='center'
					className={localStyles.content}>
					<Row align={"middle"} className={localStyles.title}>
						<h3>Registracija</h3>
					</Row>
					<Row>
						<Form
							name='register'
							initialValues={{ remember: false }}
							className={localStyles.form}
							onFinish={onFinish}>
							<Flex vertical justify='center' align='center'>
								<span className={localStyles.informationText}>
									Unesite podatke novog korisnika za nastavak
								</span>
								{registerErrorMessage !== "" && (
									<span className={localStyles.errorText}>
										{registerErrorMessage}
									</span>
								)}
								{registerSuccessMessage !== "" && (
									<span className={localStyles.successText}>
										{registerSuccessMessage}
									</span>
								)}
							</Flex>
							<Form.Item
								name='firstname'
								rules={[
									{
										required: true,
										message: (
											<span
												className={
													localStyles.fieldValidationError
												}>
												Unesite ime!
											</span>
										),
									},
								]}>
								<Input
									suffix={<IdcardOutlined />}
									placeholder='Ime'
									ref={firstNameRef}
									className={localStyles.inputWidth}
								/>
							</Form.Item>
							<Form.Item
								name='lastname'
								rules={[
									{
										required: true,
										message: (
											<span
												className={
													localStyles.fieldValidationError
												}>
												Unesite prezime!
											</span>
										),
									},
								]}>
								<Input
									suffix={<IdcardOutlined />}
									placeholder='Prezime'
									ref={lastNameRef}
									className={localStyles.inputWidth}
								/>
							</Form.Item>
							<Form.Item
								name='title'
								rules={[
									{
										required: true,
										message: (
											<span
												className={
													localStyles.fieldValidationError
												}>
												Unesite titulu!
											</span>
										),
									},
								]}>
								<Input
									suffix={<Mortarboard />}
									placeholder='Titula'
									ref={titleRef}
									className={localStyles.inputWidth}
								/>
							</Form.Item>
							<Form.Item
								name='sex'
								rules={[
									{
										required: true,
										message: (
											<span
												className={
													localStyles.fieldValidationError
												}>
												Odaberite spol!
											</span>
										),
									},
								]}>
								<Select
									placeholder='Spol'
									allowClear
									ref={sexRef}
									className={localStyles.inputWidth}>
									<Option value='male'>Muški</Option>
									<Option value='female'>Ženski</Option>
								</Select>
							</Form.Item>
							<Form.Item
								name='username'
								rules={[
									{
										required: true,
										pattern: new RegExp(
											"^[a-zA-Z0-9]{5,255}$"
										),
										message: (
											<span
												className={
													localStyles.fieldValidationError
												}>
												Unesite korisničko ime duljine
												barem 5 znakova!
											</span>
										),
									},
								]}
								className={localStyles.usernameInput}>
								<Input
									suffix={<UserOutlined />}
									placeholder='Korisničko ime'
									ref={usernameRef}
									className={localStyles.inputWidth}
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
										message: (
											<Row justify={"center"}>
												<span>
													Zaporka se mora sastojati od
													barem 1 broja,
												</span>
												<span>
													1 malog, 1 velikog slova, 1
													specijalnog znaka
												</span>
												<span>
													te ne smije sadržavati
													razmake!
												</span>
											</Row>
										),
									},
								]}
								className={localStyles.passwordInput}>
								<Input
									suffix={<LockOutlined />}
									type='password'
									placeholder='Zaporka'
									ref={passwordRef}
									className={localStyles.inputWidth}
								/>
							</Form.Item>
							<Form.Item
								name='confirmPassword'
								dependencies={["password"]}
								hasFeedback
								rules={[
									{
										required: true,
										message: (
											<span
												className={
													localStyles.fieldValidationError
												}>
												Molimo vas potvrdite zaporku!
											</span>
										),
									},
									({ getFieldValue }) => ({
										validator(_, value) {
											if (
												!value ||
												getFieldValue("password") ===
													value
											) {
												return Promise.resolve();
											}
											return Promise.reject(
												new Error(
													"Zaporke nisu jednake!"
												)
											);
										},
									}),
								]}>
								<Input.Password
									placeholder='Potvrda zaporke'
									className={localStyles.inputWidth}
								/>
							</Form.Item>
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
													"Potvrdite pravila korištenja i politiku privatnosti!"
												)
											);
										},
									}),
								]}
								className={localStyles.checkbox}>
								<Checkbox
									name='acceptCheckbox'
									id='tos-checkbox'
									className={localStyles.inputWidth}>
									Prihvaćam pravila korištenja i politiku
									privatnosti!
								</Checkbox>
							</Form.Item>
							<Form.Item>
								<Button
									type='text'
									shape='round'
									size='large'
									htmlType='submit'
									className={localStyles.btnRoundedLight}>
									Registriraj korisnika
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

export default Register;
