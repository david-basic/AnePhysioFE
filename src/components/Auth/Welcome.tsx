import { type FC, useEffect } from "react";
import styles from "./Welcome.module.css";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import client_routes from "../../config/client_routes";
import { useAppSelector } from "../../hooks/use_app_selector";

const Welcome: FC = () => {
	const navigate = useNavigate();
	const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

	useEffect(() => {
		if (isLoggedIn) {
			navigate(client_routes.ROUTE_HOME, { replace: true });
		}
	}, [isLoggedIn, navigate]);

	const navigateToRegister = () => {
		navigate(client_routes.ROUTE_AUTH_REGISTER, { replace: true });
	};
	const navigateToLogin = () => {
		navigate(client_routes.ROUTE_AUTH_LOGIN, { replace: true });
	};

	return (
		<div className={`${styles.content} ${styles["centered-element"]}`}>
			<ul className={`${styles.list}`}>
				<li>
					<h1>AnePhysio</h1>
				</li>
				<li className={styles["lighter-text"]}>
					<p>Thank you for choosing our application</p>
				</li>
				<li>
					<Button
						className={styles["btn-rounded-dark"]}
						type='text'
						shape='round'
						size='large'
						onClick={navigateToRegister}>
						Register
					</Button>
				</li>
				<li>
					<Button
						className={styles["btn-rounded-light"]}
						type='text'
						shape='round'
						size='large'
						onClick={navigateToLogin}>
						Log in
					</Button>
				</li>
				<li className={styles["lighter-text"]}>
					<p>
						By accessing the application you accept Terms and
						Conditions
						<br /> and Privacy policy!
					</p>
				</li>
			</ul>
		</div>
	);
};

export default Welcome;
