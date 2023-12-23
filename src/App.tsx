import "./App.css";
import client_routes from "./config/client_routes";
import WelcomePage from "./pages/Auth/WelcomePage";
import { useRoutes } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import Protected from "./components/Auth/Protected";
import HomePage from "./pages/HomePage";
import MainLayout from "./components/Layout/MainLayout";
import { type FC } from "react";
import { useAppSelector } from "./hooks/use_app_selector";
import JilRijekaHomePage from "./pages/departments/JilRijekaHomePage";
import CrcHomePage from "./pages/departments/CrcHomePage";
import JilSusakHomePage from "./pages/departments/JilSusakHomePage";
import KardioJilHomePage from "./pages/departments/KardioJilHomePage";

const App: FC = () => {

	const isLoggedIn = useAppSelector((state) => state.authReducer.isLoggedIn);

	const authWelcomeRoute = {
		path: client_routes.ROUTE_AUTH,
		element: <WelcomePage />,
	};
	const authLoginRoute = {
		path: client_routes.ROUTE_AUTH_LOGIN,
		element: <LoginPage />,
	};
	const authRegisterRoute = {
		path: client_routes.ROUTE_AUTH_REGISTER,
		element: <RegisterPage />,
	};
	const homeRoute = {
		path: client_routes.ROUTE_HOME,
		element: (
			<Protected
				isLoggedIn={isLoggedIn}
				children={<MainLayout children={<HomePage />} />}
			/>
		),
	};
	const jilRijekaHomeRoute = {
		path: client_routes.ROUTE_DEPT_JIL_RIJEKA,
		element: (
			<Protected
				isLoggedIn={isLoggedIn}
				children={<MainLayout children={<JilRijekaHomePage />} />}
			/>
		),
	};
	const crcHomeRoute = {
		path: client_routes.ROUTE_DEPT_CRC,
		element: (
			<Protected
				isLoggedIn={isLoggedIn}
				children={<MainLayout children={<CrcHomePage />} />}
			/>
		),
	};
	const jilSusakHomeRoute = {
		path: client_routes.ROUTE_DEPT_JIL_SUSAK,
		element: (
			<Protected
				isLoggedIn={isLoggedIn}
				children={<MainLayout children={<JilSusakHomePage />} />}
			/>
		),
	};
	const kardioJilHomeRoute = {
		path: client_routes.ROUTE_DEPT_KARDIO_JIL,
		element: (
			<Protected
				isLoggedIn={isLoggedIn}
				children={<MainLayout children={<KardioJilHomePage />} />}
			/>
		),
	};

	const routing = useRoutes([
		authWelcomeRoute,
		authLoginRoute,
		authRegisterRoute,
		homeRoute,
		jilRijekaHomeRoute,
		crcHomeRoute,
		jilSusakHomeRoute,
		kardioJilHomeRoute,
	]);

	return <>{routing}</>;
};

export default App;
