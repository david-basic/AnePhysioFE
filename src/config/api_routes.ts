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
};

export default api_routes;
