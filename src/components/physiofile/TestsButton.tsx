import { type FC, type MouseEventHandler } from "react";
import styles from "./TestsButton.module.css";

type TestsButtonProps = {
	label: string;
	onClick?: MouseEventHandler<HTMLButtonElement>;
};

const TestsButton: FC<TestsButtonProps> = ({
	label,
	onClick,
}: TestsButtonProps) => {
	return (
		<button className={styles.testsbutton} onClick={onClick}>
			{label}
		</button>
	);
};

export default TestsButton;
