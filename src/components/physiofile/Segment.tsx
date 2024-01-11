import { type PropsWithChildren, type FC, HTMLAttributes } from "react";
import styles from "./PhysioFile.module.css";

type SegmentProps = {
	isContent?: boolean;
} & PropsWithChildren &
	HTMLAttributes<HTMLDivElement>;

const Segment: FC<SegmentProps> = ({
	isContent,
	children,
	...divProps
}: SegmentProps) => {
	const { className: passedClassName, ...otherDivProps } = divProps;

	const componentStyle = isContent ? styles.segmentContent : styles.segments;

	return (
		<div
			className={
				passedClassName
					? `${passedClassName} ${componentStyle}`
					: componentStyle
			}
			{...otherDivProps}>
			{children}
		</div>
	);
};

Segment.defaultProps = {
	isContent: false,
};

export default Segment;
