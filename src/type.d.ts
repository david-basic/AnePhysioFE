import { DepartmentVM } from "./models/DepartmentVM";

/**
 * Type used for configuring the request towards a API
 * @param url Url towards which the request is going to be made
 * @param method Optional parameter that denotes a method request should be made with
 * @param body Optional parameter for sending data to the API for processing
 * @param headers Optional parameter that denotes headers that should be used with a request towards a API
 *
 */
type RequestConfig = {
	url: RequestInfo | URL;
	method?: "GET" | "POST" | "DELETE" | "PUT" | undefined;
	body?: any;
	headers?: HeadersInit | undefined;
};
/**
 * Type used to define the initial state of authentication in the application
 * @param isLoggedIn Denotes if the user is logged in or not. False by default
 * @param username Username of the logged in user. Empty string by default
 * @param accessToken Access token used for JWT authentication
 * @param refreshToken Refresh token used for refreshing access token in JWT authentication
 * @param tokenType Token type used in JWT authentication. "Bearer" by default
 *
 */
type AuthInitState = {
	isLoggedIn: boolean;
	username: string;
	accessToken: string;
	refreshToken: string;
	tokenType: string;
};
/**
 * Interface used to define data object needed for login request on the API
 * @param username Username user input on the login form
 * @param password Password user input on the login form
 * 
 */
interface LoginRequestData {
	username: string;
	password: string;
};
/**
 * Interface used to define response object acquired as a response to the login request on the API
 * @param timestamp Timestamp denoting time of user login
 * @param status Http status of the request in number form
 * @param success Boolean denoting success (true) or failure (false) of the login request
 * @param message Appropriate message with a text client can display to the user
 * @param data Response data send by the API as a response to the login request
 * 
 */
interface ApiLoginResponse {
	timestamp: Date;
	status: number;
	success: boolean;
	message: string;
	data: LoginResponseData;
};
/**
 * Interface used to define data object with tokens needed for authentication of a user
 * @param accessToken Access token used for JWT authentication
 * @param refreshToken Refresh token used for refreshing accessToken in JWT authentication
 * @param tokenType Token type used in JWT authentication
 * 
 */
interface LoginResponseData {
	accessToken: string;
	refreshToken: string;
	tokenType: string;
};
/**
 * Interface used to define data object needed for register request on the API
 * @param firstname First name user input on the register form
 * @param lastname Last name user input on the register form
 * @param username Username user input on the register form
 * @param password Password user input on the register form
 * 
 */
interface RegisterRequestData {
	firstname: string;
	lastname: string;
	username: string;
	password: string;
};
/**
 * Interface used to define response object acquired as a response to the register request on the API
 * @param timestamp Timestamp denoting time of user register
 * @param status Http status of the request in number form
 * @param success Boolean denoting success (true) or failure (false) of the register request
 * @param message Appropriate message with a text client can display to the user
 * 
 */
interface ApiRegisterResponse {
	timestamp: Date;
	status: number;
	success: boolean;
	message: string;
	data?: any;
};
/**
 * Interfaces used to define response object acquired as a response to the get all departments request on the API
 * @param timestamp Timestamp denoting time of response
 * @param status Http status of the request in number form
 * @param success Boolean denoting success (true) or failure (false) of the api request
 * @param message Appropriate message in string format
 * @param data Department data
 */
interface ApiGetAllDepartmentsResponse {
	timestamp: Date;
	status: number;
	message: string;
	success?: boolean;
	error?: string;
	data?: DepartmentVM[];
	path?: string;
}
/**
 * Type used to define the initial state of the DepartmentLocalities state slice
 * @param jilRIjeka Defining Jil Rijeka locality state
 * @param jilSusak Defining Jil Sušak locality state
 * @param crc Defining CRC locality state
 * @param kardioJil Defining Kardio JIL locality state
 */
type DepartmentLocalitiesInitState = {
	jilRIjeka: DepartmentVM;
	jilSusak: DepartmentVM;
	crc: DepartmentVM;
	kardioJil: DepartmentVM;
}