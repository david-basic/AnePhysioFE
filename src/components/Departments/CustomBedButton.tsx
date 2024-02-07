import {
	type ReactNode,
	type FC,
	MouseEvent,
	ButtonHTMLAttributes,
} from "react";
import localStyles from "./CustomBedButton.module.css";
import { useNavigate } from "react-router-dom";
import confirm from "antd/es/modal/confirm";
import { Row } from "antd";

type CustomBedButtonProps = {
	label: string;
	to: string;
	bedIsEmpty: boolean;
	moreThenOnePhysioFileExists?: boolean;
	icon?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const CustomBedLink: FC<CustomBedButtonProps> = ({
	label,
	moreThenOnePhysioFileExists,
	icon,
	bedIsEmpty,
	to,
	...buttonProps
}: CustomBedButtonProps) => {
	const { className: passedClassName, ...otherButtonProps } = buttonProps;
	const navigate = useNavigate();

	const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
		if (bedIsEmpty) {
			e.preventDefault();
			return;
		}

		if (moreThenOnePhysioFileExists) {
			e.preventDefault();
			confirm({
				content: <p>TODO remove confirm add proper modal</p>,
				onOk() {
					navigate(to);
				},
			});
		}

		navigate(to);
	};

	return (
		<Row
			align={"middle"}
			className={bedIsEmpty ? localStyles.rowEmpty : localStyles.row}>
			<button
				className={
					passedClassName
						? `${passedClassName} ${localStyles.customButton}`
						: localStyles.customButton
				}
				style={
					bedIsEmpty
						? { cursor: "not-allowed" }
						: { cursor: "pointer" }
				}
				disabled={bedIsEmpty}
				onClick={bedIsEmpty ? undefined : handleClick}
				{...otherButtonProps}>
				{icon && (
					<span
						className={
							bedIsEmpty
								? localStyles.bedEmptyIcon
								: localStyles.icon
						}>
						{icon}
					</span>
				)}
				<span
					className={
						bedIsEmpty
							? localStyles.bedEmptyLabel
							: localStyles.label
					}>
					{label}
				</span>
			</button>
		</Row>
	);
};

CustomBedLink.defaultProps = {
	moreThenOnePhysioFileExists: false,
};

export default CustomBedLink;
