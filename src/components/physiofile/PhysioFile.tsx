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
import { FunctionalDiagnosisVM } from "../../models/physiofile/functionalDiagnosis/FunctionalDiagnosisVM";
import PhysioGoals from "./physioGoals/PhysioGoals";
import PhysioPlans from "./physioPlans/PhysioPlans";
import PhysioNotes from "./notes/PhysioNotes";

type PhysioFileProps = {
	physioFile: PhysioFileVM | undefined;
	fdList: FunctionalDiagnosisVM[] | undefined;
	isLoading: boolean;
};

const PhysioFile: FC<PhysioFileProps> = ({
	isLoading,
	fdList,
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
										physioFile={physioFile}
										patientFunctionalDiagnoses={
											physioFile.patientFunctionalDiagnoses
										}
										fdList={fdList ? fdList : undefined}
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
							<Segment id='physiotherapyGoals'>
								<SegmentTitle label='Cilj fizioterapije:' />
								<Segment isContent>
									<PhysioGoals
										physioFile={physioFile}
										goalsList={physioFile.fullGoalsList}
										patientGoals={physioFile.patientGoals}
									/>
								</Segment>
							</Segment>
							<Segment id='physiotherapyPlans'>
								<SegmentTitle label='Plan fizioterapije:' />
								<Segment isContent>
									<PhysioPlans
										physioFile={physioFile}
										plansList={physioFile.fullPlansList}
										patientPlans={physioFile.patientPlans}
									/>
								</Segment>
							</Segment>
							<Segment id='physioNotes'>
								<SegmentTitle label='Zabilješke:' />
								<Segment isContent>
									<PhysioNotes notes={physioFile.notes} />
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
