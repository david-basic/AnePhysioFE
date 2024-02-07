import React, { FC, PropsWithChildren } from "react";
import localStyles from "./CustomCard.module.css";

export type CustomCardProps = {} & React.HTMLAttributes<HTMLDivElement> &
	PropsWithChildren;

const CustomCard: FC<CustomCardProps> = ({
	children,
	...divProps
}: CustomCardProps) => {
	const { className: passedClassName, ...otherDivProps } = divProps;
    
	return (
		<div
			className={
				passedClassName
					? `${passedClassName} ${localStyles.card}`
					: localStyles.card
			}
			{...otherDivProps}>
			{children}
		</div>
	);
};

export default CustomCard;
