export const clientRoutesParams = {
	patientId: ":patientId",
	physioFileId: ":physioFileId",
};

const client_routes = {
	ROUTE_HOME: "/",

	ROUTE_AUTH: "/auth",
	ROUTE_AUTH_LOGIN: "/auth/login",
	ROUTE_AUTH_REGISTER: "/auth/register",

	ROUTE_AUTH_LOGOUT: "/auth/logout",

	ROUTE_USER_ABOUT: "/user/about",

	ROUTE_DEPT_JIL_RIJEKA: "/dept/jil-rijeka",
	ROUTE_DEPT_CRC: "/dept/crc",
	ROUTE_DEPT_JIL_SUSAK: "/dept/jil-susak",
	ROUTE_DEPT_KARDIO_JIL: "/dept/kardio-jil",

	ROUTE_PHYSIO_FILE_BY_ID: `/patient/physio-file/${clientRoutesParams.physioFileId}`,

	ROUTE_PRINTING_PAGE: `/patient/printing-page/${clientRoutesParams.patientId}`,
};

export const sideBarKey = {
	Home: "sidebar-home",
	JilRijeka: "sidebar-jil-rijeka",
	CRC: "sidebar-crc",
	JilSusak: "sidebar-jil-susak",
	KardioJil: "sidebar-kardio-jil",
	LogOut: "sidebar-logout",
	RegisterNewUser: "sidebar-register-new-user",
};

export default client_routes;
