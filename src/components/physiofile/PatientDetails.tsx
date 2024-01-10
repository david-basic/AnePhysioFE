import { type FC } from "react";
import { PatientVM } from "../../models/patient/PatientVM";
import { GenderMale } from "react-bootstrap-icons";
import styles from "./PatientDetails.module.css";
import LoadingSpinner from "../LoadingSpinner";
import { Flex } from "antd";

type PatientDetailsProps = {
	patientData: PatientVM | undefined;
};

const PatientDetails: FC<PatientDetailsProps> = ({
	patientData,
}: PatientDetailsProps) => {
	const dateOptions: Intl.DateTimeFormatOptions = {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		timeZone: "CET",
	};

	return (
		<>
			{patientData && (
				<>
					<Flex vertical={false} style={{ height: "inherit" }}>
						<div style={{ width: "60%" }} className={styles.stacking}>
							<span className={styles.mbstyle}>
								MB {patientData.identificationNumber}
							</span>
							<span className={styles.iconAndText}>
								<GenderMale className={styles.iconstyle} /> {" "}
								<span className={styles.nameagestyle}>
									{patientData.firstName}{" "}
									{patientData.lastName},{" "}
									{patientData.patientAge}
								</span>
							</span>
                            <span className={styles.datestyle}>
								{new Date(
									Date.parse(patientData.birthDate)
								).toLocaleDateString("hr-HR", dateOptions).split(' ').join('')}
							</span>
                            <span className={styles.address}>
								{patientData.patientAddress.fullAddress}
							</span>
						</div>
						<div style={{ width: "5%" }}></div>
						<div
							style={{ width: "35%" }}
							className={styles.titleText}>
							<span>FIZIOTERAPEUTSKI</span> <br />
							<span>KARTON</span>
						</div>
					</Flex>
				</>
			)}
			{!patientData && <LoadingSpinner />}
		</>
	);
};

export default PatientDetails;
