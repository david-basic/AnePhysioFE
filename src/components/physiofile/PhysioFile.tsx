import { type FC } from "react";
import LoadingSpinner from "../LoadingSpinner";
import { type PhysioFileVM } from "../../models/physiofile/PhysioFileVM";
import { Flex } from "antd";
import styles from "./PhysioFile.module.css";
import Segment from "./segments/Segment";
import SegmentTitle from "./segments/SegmentTitle";
import FunctionalDiagnoses from "./functionalDiagnosis/FunctionalDiagnoses";
import Assessment from "./assessment/Assessment";
import MkbsAndOperations from "./mkbsAndOperations/MkbsAndOperations";

type PhysioFileProps = {
	physioFile: PhysioFileVM | undefined;
	isLoading: boolean;
};

const PhysioFile: FC<PhysioFileProps> = ({
	isLoading,
	physioFile,
}: PhysioFileProps) => {
	return (
		<>
			{!physioFile || isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<Flex
						vertical={true}
						align='start'
						style={{
							height: "inherit",
							fontFamily: "Nunito, sans-serif",
						}}>
						<div style={{ height: "100%" }}>
							<Segment id='leadingDiagnosis'>
								<SegmentTitle label='Vodeća dijagnoza:' />
								<Segment isContent className={styles.texts}>
									{physioFile.patient.leadingMkb && (
										<span>
											{
												physioFile.patient.leadingMkb
													.displayName
											}
										</span>
									)}
									{!physioFile.patient.leadingMkb && (
										<span>
											Nema definirane vodeće dijagnoze
										</span>
									)}
								</Segment>
							</Segment>
							<Segment id='functionalDiagnoses'>
								<SegmentTitle label='Funkcionalna dijagnoza:' />
								<Segment isContent className={styles.texts}>
									<FunctionalDiagnoses
										patientDiagnoses={
											physioFile.patientFunctionalDiagnoses
										}
									/>
								</Segment>
							</Segment>
							<Segment id='assessment'>
								<SegmentTitle label='Početna procjena:' />
								<Segment isContent>
									<Assessment
										patientAssessment={
											physioFile.assessment
										}
									/>
								</Segment>
							</Segment>
							<Segment id='otherMkbsAndOperations'>
								<SegmentTitle label='Komorbiditeti i operativni postupci:' />
								<Segment isContent>
									<MkbsAndOperations
										mkbs={physioFile.patient.patientMkbs}
										operations={
											physioFile.patient.operations
										}
									/>
								</Segment>
							</Segment>
						</div>
					</Flex>
				</>
			)}
		</>
	);
};

export default PhysioFile;
