import {
	type ButtonHTMLAttributes,
	type ReactNode,
	type FC,
	type MouseEventHandler,
	MouseEvent,
	useState,
} from "react";
import styles from "./PrintButton.module.css";

type PrintButtonProps = {
	label: string;
	icon?: ReactNode;
	toggledOff?: boolean;
	onClick?: MouseEventHandler<HTMLButtonElement>;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

const PrintButton: FC<PrintButtonProps> = ({
	label,
	icon,
	toggledOff = false,
	onClick,
	...buttonProps
}: PrintButtonProps) => {
	const [isClicked, setIsClicked] = useState<boolean>(false);
	const [isToggledOff, setIsToggledOff] = useState<boolean>(toggledOff);
	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setIsClicked(!isClicked);
		onClick?.(event);
		setIsToggledOff(!isToggledOff);
	};

	return (
		<button
			className={`${
				isToggledOff
					? styles.printToggleStyleClicked
					: styles.printToggleStyleDefault
			} ${
				isClicked
					? isToggledOff
						? styles.printToggleStyleClicked
						: styles.printToggleStyleDefault
					: ""
			}`}
			onClick={handleClick}
			{...buttonProps}>
			{label} {icon && <span className={styles.icon}>{icon}</span>}
		</button>
	);
};

export default PrintButton;
