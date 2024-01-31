import { type FC } from "react";
import styles from "./LoadingSpinner.module.css";

const LoadingSpinner: FC = () => {
	return (
		<div className={styles.loadingSpinner}>
			<p>Loading...</p>
		</div>
	);
};

export default LoadingSpinner;
