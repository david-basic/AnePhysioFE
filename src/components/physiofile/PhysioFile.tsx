import { type FC } from "react";
import LoadingSpinner from "../LoadingSpinner";
import { type PhysioFileVM } from "../../models/physiofile/PhysioFileVM";
import { Flex } from "antd";
import styles from "./PhysioFile.module.css";
import Segment from "./Segment";
import SegmentTitle from "./SegmentTitle";

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
							<Segment style={{ height: "auto" }}>
								<SegmentTitle label='Vodeća dijagnoza:' />
								<Segment isContent style={{ height: "auto" }}>
									{physioFile.patient.leadingMkb && (
										<span className={styles.texts}>
											{
												physioFile.patient.leadingMkb
													.displayName
											}
										</span>
									)}
									{!physioFile.patient.leadingMkb && (
										<span className={styles.texts}>
											Nema definirane vodeće dijagnoze
										</span>
									)}
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

/*

<div
	style={{ height: "auto" }}
	className={styles.segments}>
	<span className={styles.titles}>
		Vodeća dijagnoza:
	</span>
	<div
		style={{ height: "auto" }}
		className={styles.segmentContent}>
		{physioFile.patient.leadingMkb && (
			<span className={styles.texts}>
				{
					physioFile.patient.leadingMkb
						.displayName
				}
			</span>
		)}
		{!physioFile.patient.leadingMkb && (
			<span className={styles.texts}>
				Nema definirane vodeće dijagnoze
			</span>
		)}
	</div>
</div>


*/
