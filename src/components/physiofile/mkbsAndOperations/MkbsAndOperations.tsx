import { Flex } from "antd";
import { type FC } from "react";
import { type PatientMkbVM } from "../../../models/patient/PatientMkbVM";
import { type OperationVM } from "../../../models/patient/OperationVM";
import parentStyles from "../PhysioFile.module.css";

type MkbsAndOperationsProps = {
	mkbs: PatientMkbVM[];
	operations: OperationVM[] | undefined;
};

const MkbsAndOperations: FC<MkbsAndOperationsProps> = ({
	mkbs,
	operations,
}: MkbsAndOperationsProps) => {
	const dateOptions: Intl.DateTimeFormatOptions = {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		timeZone: "CET",
	};
	return (
		<Flex
			vertical={true}
			align='start'
			style={{
				fontFamily: "Nunito, sans-serif",
			}}
			className={parentStyles.texts}>
			{mkbs && mkbs.length > 1 ? (
				mkbs.slice(1).map((pmkb, index) => <span key={index}>{pmkb.displayName}</span>)
			) : (
				<span>Nema definiranih komorbiditeta</span>
			)}
			<hr />
			{operations &&
				operations.map((op, index) => (
					<span key={index}>
						{new Date(Date.parse(op.procedureDate))
							.toLocaleDateString("hr-HR", dateOptions)
							.split(" ")
							.join("")}{" "}
						{op.procedureName}
					</span>
				))}
			{!operations && <span>Nema definiranih operativnih postupaka</span>}
		</Flex>
	);
};

export default MkbsAndOperations;
