import {
	type ReactNode,
	type FC,
	type LinkHTMLAttributes,
	MouseEvent,
} from "react";
import styles from "./CustomLink.module.css";
import { Link, useNavigate } from "react-router-dom";
import confirm from "antd/es/modal/confirm";
import fileStyles from "./physiofile/PhysioFile.module.css";

type CustomLinkProps = {
	label: string;
	to: string;
	askForConfirmation?: boolean;
	confirmationText?: string;
	icon?: ReactNode;
} & LinkHTMLAttributes<HTMLAnchorElement>;

const CustomLink: FC<CustomLinkProps> = ({
	label,
	askForConfirmation,
	confirmationText,
	icon,
	to,
	...linkProps
}: CustomLinkProps) => {
	const { className: passedClassName, ...otherLinkProps } = linkProps;
	const navigate = useNavigate();

	const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
		if (askForConfirmation) {
			e.preventDefault();
			confirm({
				content: (
					<p className={fileStyles.titles}>{confirmationText}</p>
				),
				onOk() {
					navigate(to);
				},
			});
		}
	};

	return (
		<Link
			to={to}
			className={
				passedClassName
					? `${passedClassName} ${styles.customLink}`
					: styles.customLink
			}
			onClick={handleClick}
			{...otherLinkProps}>
			{label} {icon && <span className={styles.icon}>{icon}</span>}
		</Link>
	);
};

CustomLink.defaultProps = {
	askForConfirmation: false,
	confirmationText: "Jeste li sigurni?",
};

export default CustomLink;
