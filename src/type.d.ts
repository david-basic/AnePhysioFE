import { DepartmentVM } from "./models/department/DepartmentVM";
import { PhysioFileVM } from "./models/physiofile/PhysioFileVM";
import { FunctionalDiagnosisVM } from "./models/physiofile/functionalDiagnosis/FunctionalDiagnosisVM";

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
	tokenIsValid: boolean;
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
}
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
}
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
}
/**
 * Interface used to define response object acquired as a response to the register request on the API
 * @param timestamp Timestamp denoting time of user register
 * @param status Http status of the request in number form
 * @param success Boolean denoting success (true) or failure (false) of the register request
 * @param message Appropriate message with a text client can display to the user
 * @param data It is null always
 */
interface ApiRegisterResponse {
	timestamp: Date;
	status: number;
	success: boolean;
	message: string;
	data?: any;
}
/**
 * Interfaces used to define a response object gained from a request on the API
 * @param timestamp Timestamp denoting time of response
 * @param status Http status of the request in number form
 * @param message Appropriate message in string format
 * @param success Boolean denoting success if request was made successfully
 * @param error String denoting the error if it happens
 * @param data Data returned by the request, Type of which is defined at the moment of fetching
 * @param path Response URI that failed to provide the requested data
 */
interface ApiResponse<T> {
	timestamp: Date;
	status: number;
	message: string;
	success?: boolean;
	error?: string;
	data?: T;
	path?: string;
}
/**
 * Interface used when there is no return data from the API
 * @param NoReturnData Will always be null in API response with no return data
 */
interface NoReturnData {
	noData: string;
}
/**
 * Type used to define the initial state of the DepartmentLocalities state slice
 * @param jilRIjeka Defining Jil Rijeka locality state
 * @param jilSusak Defining Jil Sušak locality state
 * @param crc Defining CRC locality state
 * @param kardioJil Defining Kardio JIL locality state
 */
type DepartmentLocalitiesInitStateType = {
	jilRIjeka: DepartmentVM;
	jilSusak: DepartmentVM;
	crc: DepartmentVM;
	kardioJil: DepartmentVM;
};
/**
 * @param physioFile Defines a Physiotherapist file object
 * @param functionalDiagnosesList Defines a list of functional diagnoses
 * @param xyDataSaved Indicates if the current state was saved to DB
 */
type PhysioFileInitStateType = {
	physioFile: PhysioFileVM;
	functionalDiagnosisList: FunctionalDiagnosisVM[];
	physioFileDataSaved: boolean;
	rassModalDataSaved: boolean;
	gcsModalDataSaved: boolean;
	vasModalDataSaved: boolean;
	mmtModalDataSaved: boolean;
	cpaxModalDataSaved: boolean;
	fdModalDataSaved: boolean;
};
/**
 * Type to persist data between refreshes
 */
type PhysioFilePersistanceInitStateType = {
	physioFile: PhysioFileVM;
	functionalDiagnosisList: FunctionalDiagnosisVM[];
};
/**
 * Type used for updating a PatientRass entity in the array
 * @param idToUpdate Defines the id of the rass in the Array. Id is generated sequentially
 * for that array when the object is first created
 * @param additionalDescription Defines the new updated description that needs saving for that object
 */
type PatientRassAdditionalNotesUpdateType = {
	idToUpdate: string;
	additionalDescription: string;
};
