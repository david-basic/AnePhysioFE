export const routesParams = {
	API: "http://localhost:8080/api/v1",
};

const api_routes = {
	ROUTE_HOME: `${routesParams.API}`,

	ROUTE_AUTH_LOGIN: `${routesParams.API}/user-management/auth/login`,
	ROUTE_AUTH_REGISTER: `${routesParams.API}/user-management/auth/register`,

	ROUTE_DEPT_GET_ALL: `${routesParams.API}/department-management/dept`,

	ROUTE_PATIENT_GET: `${routesParams.API}/patient-management/patients`,
};

export default api_routes;
