import "./App.css";
import client_routes from "./config/client_routes";
import WelcomePage from "./pages/authentication/WelcomePage";
import { useLocation, useRoutes } from "react-router-dom";
import LoginPage from "./pages/authentication/LoginPage";
import RegisterPage from "./pages/authentication/RegisterPage";
import Protected from "./components/authentication/Protected";
import MainLayout from "./components/layout/MainLayout";
import { type FC } from "react";
import { useAppSelector } from "./hooks/use_app_selector";
import JilRijekaHomePage from "./pages/departments/JilRijekaHomePage";
import CrcHomePage from "./pages/departments/CrcHomePage";
import JilSusakHomePage from "./pages/departments/JilSusakHomePage";
import KardioJilHomePage from "./pages/departments/KardioJilHomePage";
import PatientPage from "./pages/physiofile/PatientPage";
import PhysioFileLayout from "./components/layout/PhysioFileLayout";
import PrintingPage from "./pages/printing/PrintingPage";
import HomePage from "./pages/HomePage";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const App: FC = () => {
	const isLoggedIn = useAppSelector((state) => state.authReducer.isLoggedIn);
	const location = useLocation();

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
		element: (
			<Protected
				isLoggedIn={isLoggedIn}
				children={<MainLayout children={<RegisterPage />} />}
			/>
		),
	};
	const homeRoute = {
		path: client_routes.ROUTE_HOME,
		element: (
			<Protected isLoggedIn={isLoggedIn} children={<HomePage />} />
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
	const patientPageRoute = {
		path: client_routes.ROUTE_PATIENTS_DETAILS,
		element: (
			<Protected
				isLoggedIn={isLoggedIn}
				children={<PhysioFileLayout children={<PatientPage />} />}
			/>
		),
	};
	const printingPageRoute = {
		path: client_routes.ROUTE_PRINTING_PAGE,
		element: (
			<Protected isLoggedIn={isLoggedIn} children={<PrintingPage />} />
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
		patientPageRoute,
		printingPageRoute,
	]);

	return (
		<TransitionGroup>
			<CSSTransition key={location.key} classNames="fade" timeout={500}>
				{routing}
			</CSSTransition>
		</TransitionGroup>
	);
};

export default App;
