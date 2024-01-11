import { type HTMLAttributes, type FC } from "react";
import styles from "./PhysioFile.module.css";

type SegmentTitleProps = {
	label: string;
} & HTMLAttributes<HTMLSpanElement>;

const SegmentTitle: FC<SegmentTitleProps> = ({
	label,
	...spanProps
}: SegmentTitleProps) => {
	const { className: passedClassName, ...otherSpanProps } = spanProps;

	return (
		<span
			className={
				passedClassName
					? `${passedClassName} ${styles.titles}`
					: styles.titles
			}
			{...otherSpanProps}>
			{label}
		</span>
	);
};

export default SegmentTitle;
