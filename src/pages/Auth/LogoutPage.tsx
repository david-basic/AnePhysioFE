import { FC } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/auth-slice";
import client_routes from "../../config/client_routes";
import styles from "./LogoutPage.module.css";
import { Button } from "antd";
import localforage from "localforage";

const LogoutPage: FC = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const logoutHandler = () => {
		localforage.clear();
		sessionStorage.clear();
		localStorage.clear();

		dispatch(authActions.setIsLoggedIn(false));
		dispatch(authActions.resetAllStateToDefaults());

		navigate(client_routes.ROUTE_AUTH, { replace: true });
	};

	const cancelLogoutHandler = () => {
		navigate(client_routes.ROUTE_HOME, { replace: true });
	};

	return (
		<ul>
			<li>
				<h1>Are you sure you want to logout?</h1>
			</li>
			<li>
				<Button
					type='text'
					shape='round'
					size='large'
					onClick={logoutHandler}
					className={styles["btn-rounded-dark"]}>
					Logout
				</Button>
			</li>
			<li>
				<Button
					type='text'
					shape='round'
					size='large'
					className={styles["btn-rounded-light"]}
					onClick={cancelLogoutHandler}>
					Cancel
				</Button>
			</li>
		</ul>
	);
};

export default LogoutPage;