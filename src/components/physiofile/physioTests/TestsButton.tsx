import {
	type ButtonHTMLAttributes,
	type ReactNode,
	type FC,
	type MouseEventHandler,
} from "react";
import styles from "./TestsButton.module.css";

type TestsButtonProps = {
	label: string;
	icon?: ReactNode;
	onClick?: MouseEventHandler<HTMLButtonElement>;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const TestsButton: FC<TestsButtonProps> = ({
	label,
	icon,
	onClick,
	...buttonProps
}: TestsButtonProps) => {
	const { className: passedClassName, ...otherButtonProps } = buttonProps;

	return (
		<button
			className={
				passedClassName
					? `${passedClassName} ${styles.testsbutton}`
					: styles.testsbutton
			}
			onClick={onClick}
			{...otherButtonProps}>
			{label} {icon && <span className={styles.icon}>{icon}</span>}
		</button>
	);
};

export default TestsButton;
