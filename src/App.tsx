import "./App.css";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import client_routes from "./config/client_routes";
import WelcomePage from "./pages/Auth/WelcomePage";
import { useRoutes } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import Protected from "./components/Auth/Protected";
import HomePage from "./pages/HomePage";
import MainLayout from "./components/Layout/MainLayout";
import LogoutPage from "./pages/Auth/LogoutPage";
import { useEffect, type FC } from "react";
import localforage from "localforage";
import { authActions } from "./store/auth-slice";
import { useAppDispatch } from "./hooks/use_app_dispatch";
import { useAppSelector } from "./hooks/use_app_selector";
import JilRijekaHomePage from "./pages/departments/JilRijekaHomePage";
import CrcHomePage from "./pages/departments/CrcHomePage";
import JilSusakHomePage from "./pages/departments/JilSusakHomePage";
import KardioJilHomePage from "./pages/departments/KardioJilHomePage";

const App: FC = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		async function getStoredStates() {
			const numberOfKeysInOfflineStore = await localforage
				.length()
				.then((numberOfKeys) => {
					return numberOfKeys;
				})
				.catch(function (err) {
					console.log("Error: " + err);
					return 0;
				});

			if (numberOfKeysInOfflineStore !== 0) {
				const loginState = await localforage
					.getItem<boolean>("isLoggedIn")
					.then((value) => {
						return value !== null ? value : false;
					})
					.catch((err) => {
						return false;
					});
				dispatch(authActions.setIsLoggedIn(loginState));

				const username = await localforage
					.getItem<string>("username")
					.then((value) => {
						return value !== null ? value : "";
					})
					.catch((err) => {
						return "";
					});
				dispatch(authActions.setUsername(username));

				const accessToken = await localforage
					.getItem<string>("accessToken")
					.then((value) => {
						return value !== null ? value : "";
					})
					.catch((err) => {
						return "";
					});
				dispatch(authActions.setAccessToken(accessToken));

				const refreshToken = await localforage
					.getItem<string>("refreshToken")
					.then((value) => {
						return value !== null ? value : "";
					})
					.catch((err) => {
						return "";
					});
				dispatch(authActions.setRefreshToken(refreshToken));

				const tokenType = await localforage
					.getItem<string>("tokenType")
					.then((value) => {
						return value !== null ? value : "";
					})
					.catch((err) => {
						return "";
					});
				dispatch(authActions.setTokenType(tokenType));
			} else {
				dispatch(authActions.resetAllStateToDefaults());
			}
		}

		getStoredStates();
	}, [dispatch]);

	const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

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
		authLogoutRoute,
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
