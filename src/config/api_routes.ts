export const apiRoutesParams = {
	API: "http://localhost:8080/api/v1",
};

const api_routes = {
	ROUTE_HOME: `${apiRoutesParams.API}`,

	ROUTE_AUTH_LOGIN: `${apiRoutesParams.API}/user-management/auth/login`,
	ROUTE_AUTH_REGISTER: `${apiRoutesParams.API}/user-management/auth/register`,
	ROUTE_AUTH_REFRESH_TOKEN: `${apiRoutesParams.API}/user-management/auth/refresh-token`,

	ROUTE_DEPT_GET_ALL: `${apiRoutesParams.API}/department-management/dept`,

	ROUTE_PATIENT_GET: `${apiRoutesParams.API}/patient-management/patients`,

	ROUTE_PHYSIO_FILE_GET: `${apiRoutesParams.API}/physiofile-management/physiofiles`, 
	ROUTE_PHYSIO_FILE_GET_BY_PATIENT_ID: `${apiRoutesParams.API}/physiofile-management/physiofiles/patient`, 
	ROUTE_PHYSIO_FILE_ADD_NEW_PATIENT_RASS: `${apiRoutesParams.API}/physiofile-management/physiofiles/new-patient-rass`,

};

export default api_routes;
