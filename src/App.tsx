import "./App.css";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import client_routes from "./config/client_routes";
import WelcomePage from "./pages/Auth/WelcomePage";
import { useRoutes } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import Protected from "./components/Auth/Protected";
import HomePage from "./pages/HomePage";
import MainLayout from "./components/Layout/MainLayout";
import LogoutPage from "./pages/Auth/LogoutPage";
import { FC } from "react";

const App: FC = () => {
	const isLoggedIn: boolean = useSelector(
		(state: RootState) => state.auth.isLoggedIn
	);

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
	const authLogoutRoute = {
		path: client_routes.ROUTE_AUTH_LOGOUT,
		element: (
			<Protected
				isLoggedIn={isLoggedIn}
				children={<MainLayout children={<LogoutPage />} />}
			/>
		),
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

	const routing = useRoutes([
		authWelcomeRoute,
		authLoginRoute,
		authLogoutRoute,
		authRegisterRoute,
		homeRoute,
	]);

	return <>{routing}</>;
};

export default App;
