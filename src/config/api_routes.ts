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

	ROUTE_FUNC_DIAG_GET_ALL: `${apiRoutesParams.API}/functional-diagnosis-management/diagnoses`,
	ROUTE_FUNC_DIAG_ADD_NEW: `${apiRoutesParams.API}/functional-diagnosis-management/diagnoses/new-fd`,
	ROUTE_FUNC_DIAG_UPDATE_FD_BY_ID: `${apiRoutesParams.API}/functional-diagnosis-management/diagnoses/update-fd`,
	ROUTE_FUNC_DIAG_DELETE_FD: `${apiRoutesParams.API}/functional-diagnosis-management/diagnoses/delete-fd`,

	ROUTE_ASSESSMENT_CREATE_NEW_BY_PHYSIO_FILE_ID: `${apiRoutesParams.API}/assessment-management/assessments/new-assessment`,
	ROUTE_ASSESSMENT_ADD_NEW_PATIENT_RASS: `${apiRoutesParams.API}/assessment-management/assessments/new-patient-rass`,
	ROUTE_ASSESSMENT_DELETE_PATIENT_RASS: `${apiRoutesParams.API}/assessment-management/assessments/delete-patient-rass`,
	ROUTE_ASSESSMENT_UPDATE_PATIENT_RASS_BY_ID: `${apiRoutesParams.API}/assessment-management/assessments/update-patient-rass`,

	ROUTE_PHYSIO_TEST_CREATE_NEW_BY_PHYSIO_FILE_ID: `${apiRoutesParams.API}/physiotest-management/physiotests/new-physiotest`,
	ROUTE_PHYSIO_TEST_ADD_NEW_VAS: `${apiRoutesParams.API}/physiotest-management/physiotests/new-vas`,
	ROUTE_PHYSIO_TEST_UPDATE_VAS_BY_ID: `${apiRoutesParams.API}/physiotest-management/physiotests/update-vas`,
	ROUTE_PHYSIO_TEST_DELETE_VAS: `${apiRoutesParams.API}/physiotest-management/physiotests/delete-vas`,
	ROUTE_PHYSIO_TEST_ADD_NEW_MMT: `${apiRoutesParams.API}/physiotest-management/physiotests/new-mmt`,
	ROUTE_PHYSIO_TEST_UPDATE_MMT_BY_ID: `${apiRoutesParams.API}/physiotest-management/physiotests/update-mmt`,
	ROUTE_PHYSIO_TEST_DELETE_MMT: `${apiRoutesParams.API}/physiotest-management/physiotests/delete-mmt`,
};

export default api_routes;
