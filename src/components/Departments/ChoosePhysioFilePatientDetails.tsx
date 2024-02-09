import { type FC } from "react";
import { type PatientVM } from "../../models/patient/PatientVM";
import { Flex, Row } from "antd";
import LoadingSpinner from "../LoadingSpinner";
import localStyles from "./ChoosePhysioFilePatientDetails.module.css";

type ChoosePhysioFilePatientDetailsProps = {
	patientData: PatientVM | undefined;
};

const ChoosePhysioFilePatientDetails: FC<
	ChoosePhysioFilePatientDetailsProps
> = ({ patientData }: ChoosePhysioFilePatientDetailsProps) => {
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
					<Flex
						vertical={false}
						style={{
							height: "inherit",
							fontFamily: "Nunito, sans-serif",
						}}>
						<div
							style={{ width: "60%" }}
							className={localStyles.stacking}>
							<span className={localStyles.mbstyle}>
								MB {patientData.identificationNumber}
							</span>
							<span className={localStyles.iconAndTextContainer}>
								<span className={localStyles.icon}>
									<svg viewBox='0 0 640 512'>
										<path d='M176 288C220.1 288 256 252.1 256 208S220.1 128 176 128S96 163.9 96 208S131.9 288 176 288zM544 128H304C295.2 128 288 135.2 288 144V320H64V48C64 39.16 56.84 32 48 32h-32C7.163 32 0 39.16 0 48v416C0 472.8 7.163 480 16 480h32C56.84 480 64 472.8 64 464V416h512v48c0 8.837 7.163 16 16 16h32c8.837 0 16-7.163 16-16V224C640 170.1 597 128 544 128z'></path>
									</svg>
								</span>
								<span className={localStyles.nameAgeStyle}>
									{patientData.firstName}{" "}
									{patientData.lastName},{" "}
									{patientData.patientAge}
								</span>
							</span>
							<span className={localStyles.dateStyle}>
								{new Date(Date.parse(patientData.birthDate))
									.toLocaleDateString("hr-HR", dateOptions)
									.split(" ")
									.join("")}
							</span>
							<span className={localStyles.address}>
								{patientData.patientAddress.fullAddress}
							</span>
						</div>
						<div style={{ width: "40%" }}></div>
					</Flex>
				</>
			)}
			{!patientData && <LoadingSpinner />}
		</>
	);
};

export default ChoosePhysioFilePatientDetails;
