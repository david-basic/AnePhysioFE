import { Fragment, useEffect, useState, type FC } from "react";
import "../../App.css";
import localStyles from "./Printing.module.css";
import { type PhysioFileVM } from "../../models/physiofile/PhysioFileVM";
import { type UserVM } from "../../models/UserVm";
import { type DepartmentVM } from "../../models/department/DepartmentVM";
import { Flex } from "antd";
import generateRandomNumber from "../../util/generateRandomBigInteger";
import femaleBodyImage from "../../assets/female-01.png";
import maleBodyImage from "../../assets/male-01.png";
import RadarChart from "../physiofile/physioTests/cpax/RadarChart";
import {
	type CpaxDateTimeType,
	type CpaxTableType,
} from "../physiofile/physioTests/cpax/CpaxModal";
import "dayjs/locale/hr";
import dayjs from "dayjs";
import {
	type EyeResponseAndIndex,
	type GcsDateTimeType,
	type GcsTableType,
	type MotorResponseAndIndex,
	type VerbalResponseAndIndex,
} from "../physiofile/physioTests/gcs/GcsModal";
import {
	type MmtDateTimeType,
	type MmtGradeAndDescription,
} from "../physiofile/physioTests/mmt/MmtModal";

type PrintingProps = {
	physioFile: PhysioFileVM;
	currentPhysio: UserVM;
	patientDepartment: DepartmentVM;
	showProcedures: boolean;
	showHumanBody: boolean;
	showCpax: boolean;
	showGcs: boolean;
	showMmt: boolean;
};

type CpaxDataDefinitionType = {
	key: string;
	id: string;
	dateTime: CpaxDateTimeType;
	cpax: CpaxTableType;
};

type GcsDataDefinitionType = {
	key: string;
	id: string;
	dateTime: GcsDateTimeType;
	gcs: GcsTableType;
};

type MmtTableType = {
	gradeAndDescription: MmtGradeAndDescription;
	notes: string;
};

type MmtDataDefinitionType = {
	key: string;
	id: string;
	dateTime: MmtDateTimeType;
	gradeAndDescription: MmtGradeAndDescription;
	note: string;
	index: number;
};

const Printing: FC<PrintingProps> = ({
	physioFile,
	currentPhysio,
	patientDepartment,
	showProcedures,
	showHumanBody,
	showCpax,
	showGcs,
	showMmt,
}: PrintingProps) => {
	const [cpaxData, setCpaxData] = useState<CpaxDataDefinitionType[]>([]);
	const [gcsData, setGcsData] = useState<GcsDataDefinitionType[]>([]);
	const [mmtData, setMmtData] = useState<MmtDataDefinitionType[]>([]);
	const dateOptions: Intl.DateTimeFormatOptions = {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		timeZone: "CET",
	};

	const leftMargin = 150;
	const address =
		patientDepartment.locality.name[0] === "S"
			? "Ul. Tome Strižića 3"
			: "Krešimirova 42";

	const findMmtToDisplay = (mmtData: MmtDataDefinitionType[]) => {
		let oldestMmt: MmtTableType;
		let oldestDateTime: string = "";
		let youngestMmt: MmtTableType;
		let youngestDateTime: string = "";

		mmtData.forEach((mt) => {
			const dateTime = dayjs(`${mt.dateTime.date} ${mt.dateTime.time}`);
			if (!oldestDateTime || dateTime.isBefore(oldestDateTime)) {
				oldestDateTime = dateTime.format("YYYY-MM-DD HH:mm:ss");
				oldestMmt = {
					gradeAndDescription: mt.gradeAndDescription,
					notes: mt.note,
				};
			}

			if (!youngestDateTime || dateTime.isAfter(youngestDateTime)) {
				youngestDateTime = dateTime.format("YYYY-MM-DD HH:mm:ss");
				youngestMmt = {
					gradeAndDescription: mt.gradeAndDescription,
					notes: mt.note,
				};
			}
		});

		const oldestDateTimeReturn: MmtDateTimeType = {
			date: oldestDateTime.split(" ")[0],
			time: oldestDateTime.split(" ")[1],
		};
		const oldestMmtReturn: MmtTableType = oldestMmt!;

		const youngestDateTimeReturn: MmtDateTimeType = {
			date: youngestDateTime.split(" ")[0],
			time: youngestDateTime.split(" ")[1],
		};
		const youngestMmtReturn: MmtTableType = youngestMmt!;

		return {
			oldestDateTimeReturn,
			oldestMmtReturn,
			youngestDateTimeReturn,
			youngestMmtReturn,
		};
	};

	const findOldestGcs = (gcsData: GcsDataDefinitionType[]) => {
		let oldestGcs: GcsTableType;
		let oldestDateTime: string = "";

		gcsData.forEach((gd) => {
			const dateTime = dayjs(`${gd.dateTime.date} ${gd.dateTime.time}`);
			if (!oldestDateTime || dateTime.isBefore(oldestDateTime)) {
				oldestDateTime = dateTime.format("YYYY-MM-DD HH:mm:ss");
				oldestGcs = gd.gcs;
			}
		});

		const oldestDateTimeReturn: GcsDateTimeType = {
			date: oldestDateTime.split(" ")[0],
			time: oldestDateTime.split(" ")[1],
		};
		const oldestGcsReturn: GcsTableType = oldestGcs!;

		return {
			oldestDateTimeReturn,
			oldestGcsReturn,
		};
	};

	const findOldestCpax = (cpaxData: CpaxDataDefinitionType[]) => {
		let oldestCpax: CpaxTableType;
		let oldestDateTime: string = "";

		cpaxData.forEach((cd) => {
			const dateTime = dayjs(`${cd.dateTime.date} ${cd.dateTime.time}`);
			if (!oldestDateTime || dateTime.isBefore(oldestDateTime)) {
				oldestDateTime = dateTime.format("YYYY-MM-DD HH:mm:ss");
				oldestCpax = cd.cpax;
			}
		});

		const dateTimeReturn: CpaxDateTimeType = {
			date: oldestDateTime.split(" ")[0],
			time: oldestDateTime.split(" ")[1],
		};
		const cpaxReturn: CpaxTableType = oldestCpax!;

		return {
			dateTimeReturn,
			cpaxReturn,
		};
	};

	const findYoungestCpax = (cpaxData: CpaxDataDefinitionType[]) => {
		let youngestCpax: CpaxTableType;
		let youngestDateTime: string = "";

		cpaxData.forEach((cd) => {
			const dateTime = dayjs(`${cd.dateTime.date} ${cd.dateTime.time}`);
			if (!youngestDateTime || dateTime.isAfter(youngestDateTime)) {
				youngestDateTime = dateTime.format("YYYY-MM-DD HH:mm:ss");
				youngestCpax = cd.cpax;
			}
		});

		const dateTimeReturn: CpaxDateTimeType = {
			date: youngestDateTime.split(" ")[0],
			time: youngestDateTime.split(" ")[1],
		};
		const cpaxReturn: CpaxTableType = youngestCpax!;

		return {
			dateTimeReturn,
			cpaxReturn,
		};
	};

	useEffect(() => {
		physioFile.physioTest.cpax.forEach((cp) => {
			const cpaxDateTime = dayjs(cp.testDateTime).format(
				"YYYY.MM.DD HH:mm:ss"
			);

			const fetchedDateTime: CpaxDateTimeType = {
				date: cpaxDateTime.split(" ")[0],
				time: cpaxDateTime.split(" ")[1],
			};

			setCpaxData((prevState) => {
				const newState = [...prevState];
				newState.push({
					key: generateRandomNumber(9, true)!,
					id: cp.id,
					dateTime: fetchedDateTime,
					cpax: {
						respiratoryAOPandIndex: {
							aop: cp.aspectOfPhysicality.respiratoryFunctionAOP,
							index: physioFile.allAspectsOfPhysicality
								.filter(
									(aop) =>
										aop.aspectName ===
										cp.aspectOfPhysicality
											.respiratoryFunctionAOP.aspectName
								)
								.findIndex(
									(a) =>
										a.level ===
										cp.aspectOfPhysicality
											.respiratoryFunctionAOP.level
								),
						},
						coughAOPandIndex: {
							aop: cp.aspectOfPhysicality.coughAOP,
							index: physioFile.allAspectsOfPhysicality
								.filter(
									(aop) =>
										aop.aspectName ===
										cp.aspectOfPhysicality.coughAOP
											.aspectName
								)
								.findIndex(
									(a) =>
										a.level ===
										cp.aspectOfPhysicality.coughAOP.level
								),
						},
						movingWithinBedAOPandIndex: {
							aop: cp.aspectOfPhysicality.movingWithinBedAOP,
							index: physioFile.allAspectsOfPhysicality
								.filter(
									(aop) =>
										aop.aspectName ===
										cp.aspectOfPhysicality
											.movingWithinBedAOP.aspectName
								)
								.findIndex(
									(a) =>
										a.level ===
										cp.aspectOfPhysicality
											.movingWithinBedAOP.level
								),
						},
						dynamicSittingAOPandIndex: {
							aop: cp.aspectOfPhysicality.dynamicSittingAOP,
							index: physioFile.allAspectsOfPhysicality
								.filter(
									(aop) =>
										aop.aspectName ===
										cp.aspectOfPhysicality.dynamicSittingAOP
											.aspectName
								)
								.findIndex(
									(a) =>
										a.level ===
										cp.aspectOfPhysicality.dynamicSittingAOP
											.level
								),
						},
						sitToStandAOPandIndex: {
							aop: cp.aspectOfPhysicality.sitToStandAOP,
							index: physioFile.allAspectsOfPhysicality
								.filter(
									(aop) =>
										aop.aspectName ===
										cp.aspectOfPhysicality.sitToStandAOP
											.aspectName
								)
								.findIndex(
									(a) =>
										a.level ===
										cp.aspectOfPhysicality.sitToStandAOP
											.level
								),
						},
						standingBalanceAOPandIndex: {
							aop: cp.aspectOfPhysicality.standingBalanceAOP,
							index: physioFile.allAspectsOfPhysicality
								.filter(
									(aop) =>
										aop.aspectName ===
										cp.aspectOfPhysicality
											.standingBalanceAOP.aspectName
								)
								.findIndex(
									(a) =>
										a.level ===
										cp.aspectOfPhysicality
											.standingBalanceAOP.level
								),
						},
						steppingAOPandIndex: {
							aop: cp.aspectOfPhysicality.steppingAOP,
							index: physioFile.allAspectsOfPhysicality
								.filter(
									(aop) =>
										aop.aspectName ===
										cp.aspectOfPhysicality.steppingAOP
											.aspectName
								)
								.findIndex(
									(a) =>
										a.level ===
										cp.aspectOfPhysicality.steppingAOP.level
								),
						},
						supineToSittingAOPandIndex: {
							aop: cp.aspectOfPhysicality
								.supineToSittingOnTheEdgeOfTheBedAOP,
							index: physioFile.allAspectsOfPhysicality
								.filter(
									(aop) =>
										aop.aspectName ===
										cp.aspectOfPhysicality
											.supineToSittingOnTheEdgeOfTheBedAOP
											.aspectName
								)
								.findIndex(
									(a) =>
										a.level ===
										cp.aspectOfPhysicality
											.supineToSittingOnTheEdgeOfTheBedAOP
											.level
								),
						},
						transferringFromBedAOPandIndex: {
							aop: cp.aspectOfPhysicality
								.transferringFromBedToChairAOP,
							index: physioFile.allAspectsOfPhysicality
								.filter(
									(aop) =>
										aop.aspectName ===
										cp.aspectOfPhysicality
											.transferringFromBedToChairAOP
											.aspectName
								)
								.findIndex(
									(a) =>
										a.level ===
										cp.aspectOfPhysicality
											.transferringFromBedToChairAOP.level
								),
						},
						gripStrengthAOPandIndex: {
							aop: cp.aspectOfPhysicality.gripStrengthAOP,
							index: physioFile.allAspectsOfPhysicality
								.filter(
									(aop) =>
										aop.aspectName ===
										cp.aspectOfPhysicality.gripStrengthAOP
											.aspectName
								)
								.findIndex(
									(a) =>
										a.level ===
										cp.aspectOfPhysicality.gripStrengthAOP
											.level
								),
						},
					},
				});

				return newState;
			});
		});

		physioFile.physioTest.gcs.forEach((g) => {
			const gcsDateTime = dayjs(g.gcsDateTime).format(
				"YYYY.MM.DD HH:mm:ss"
			);
			const fetchedDateTime: GcsDateTimeType = {
				date: gcsDateTime.split(" ")[0],
				time: gcsDateTime.split(" ")[1],
			};

			const ERandIndex: EyeResponseAndIndex = {
				eyeResponse: {
					id: "",
					scale: g.eyeOpeningResponse.scale,
					score: g.eyeOpeningResponse.score,
				},
				index: physioFile.allEyeOpeningResponses.findIndex(
					(er) => er.score === g.eyeOpeningResponse.score
				),
			};

			const VRandIndex: VerbalResponseAndIndex = {
				verbalResponse: {
					id: "",
					scale: g.verbalResponse.scale,
					score: g.verbalResponse.score,
				},
				index: physioFile.allVerbalResponses.findIndex(
					(vr) => vr.score === g.verbalResponse.score
				),
			};

			const MRandIndex: MotorResponseAndIndex = {
				motorResponse: {
					id: "",
					scale: g.motorResponse.scale,
					score: g.motorResponse.score,
				},
				index: physioFile.allMotorResponses.findIndex(
					(mr) => mr.score === g.motorResponse.score
				),
			};

			setGcsData((prevState) => {
				const newState = [...prevState];
				newState.push({
					key: generateRandomNumber(9, true)!,
					id: g.id,
					gcs: {
						eyeResponseAndIndex: ERandIndex,
						verbalResponseAndIndex: VRandIndex,
						motorResponseAndIndex: MRandIndex,
					},
					dateTime: fetchedDateTime,
				});

				return newState;
			});
		});

		physioFile.physioTest.mmt.forEach((pm) => {
			const pmDateTime = dayjs(pm.mmtDateTime).format(
				"YYYY.MM.DD HH:mm:ss"
			);
			const fetchedDateTime: MmtDateTimeType = {
				date: pmDateTime.split(" ")[0],
				time: pmDateTime.split(" ")[1],
			};
			setMmtData((prevState) => {
				const newState = [...prevState];
				newState.push({
					key: generateRandomNumber(9, true)!,
					id: pm.id,
					dateTime: fetchedDateTime,
					gradeAndDescription: {
						grade: pm.grade,
						description: pm.description,
					},
					note: pm.note,
					index: physioFile.mmtList.findIndex(
						(m) => m.grade === pm.grade
					),
				});

				return newState;
			});
		});

		return () => {
			setCpaxData([]);
			setGcsData([]);
			setMmtData([]);
		};
	}, [
		physioFile.allAspectsOfPhysicality,
		physioFile.allEyeOpeningResponses,
		physioFile.allMotorResponses,
		physioFile.allVerbalResponses,
		physioFile.mmtList,
		physioFile.physioTest.cpax,
		physioFile.physioTest.gcs,
		physioFile.physioTest.mmt,
	]);

	return (
		<div className={`printing-component ${localStyles.container}`}>
			<div
				id='hospitalInfo'
				className={`${localStyles.hospitalInfo} print-hospital-info`}>
				<Flex gap={3} vertical align='center'>
					<h3 style={{ fontWeight: "bold", marginBottom: "2px" }}>
						KLINIČKI BOLNIČKI CENTAR RIJEKA
					</h3>
					<span style={{ marginBottom: "-15px" }}>
						Krešimirova 42, 51000 Rijeka
					</span>
					<h3 style={{ fontWeight: "bold", marginBottom: "2px" }}>
						Klinika za anesteziologiju, intenzivnu medicinu i
						liječenje boli
					</h3>
					<span style={{ marginBottom: "-15px" }}>
						Predstojnik: prof. dr. sc. Alen Protić, dr. med.
					</span>
					<h3 style={{ marginBottom: "2px" }}>
						{patientDepartment!.name}
					</h3>
					<span style={{ marginBottom: "2px" }}>{address}</span>
				</Flex>
			</div>
			<div style={{ height: "50px" }}></div>
			<div id='title' className={`${localStyles.printTitle} print-title`}>
				<h3 style={{ fontWeight: "bold" }}>Fizioterapeutski karton</h3>
				<span style={{ marginTop: "-15px" }}>
					Protokol broj: {generateRandomNumber(4)}
				</span>
			</div>
			<div id='mainContent' className={localStyles.mainContent}>
				<div id='basicPatientDetails' className='print-patient-details'>
					<h3
						style={{
							fontWeight: "bold",
							fontSize: "20px",
							lineHeight: "20px",
							margin: "0px",
						}}>
						{physioFile.patient.lastName.toUpperCase()}{" "}
						{physioFile.patient.firstName.toUpperCase()}
					</h3>
					<div style={{ fontSize: "18px", marginTop: "10px" }}>
						<span>
							{physioFile.patient.sex.displayName.toLowerCase()[0] ===
							"m"
								? "Rođen"
								: "Rođena"}
							:{" "}
							{new Date(Date.parse(physioFile.patient.birthDate))
								.toLocaleDateString("hr-HR", dateOptions)
								.split(" ")
								.join("")}
						</span>
						<br />
						<span>
							Adresa:{" "}
							{physioFile.patient.patientAddress.fullAddress}
						</span>
						<br />
						<span>
							Dijagnoza:{" "}
							{physioFile.patient.leadingMkb.displayName}
						</span>
						<br />
						<span>MBOO: {generateRandomNumber(9)!}</span>
						<br />
						<span>
							Datum prijema:{" "}
							{new Date(
								Date.parse(physioFile.patient.admissionDateTime)
							)
								.toLocaleDateString("hr-HR", dateOptions)
								.split(" ")
								.join("")}
						</span>
					</div>
				</div>
				<hr className={localStyles.splitterLine} />
				<Flex vertical={false}>
					<div
						id='physioFileData'
						className={localStyles.physioFileData}>
						<Flex vertical={false}>
							<div
								style={{
									width: `${showHumanBody ? "60%" : "100%"}`,
								}}>
								<h2
									style={{
										marginBottom: "-10px",
									}}
									className='print-physio-file-data'>
									Funkcionalna dijagnoza:
								</h2>
								<br />
								{physioFile.patientFunctionalDiagnoses.map(
									(fd, index) =>
										fd.selected && (
											<Fragment key={index}>
												<span
													className='print-physio-file-data'
													style={{
														fontSize: "20px",
													}}>
													{
														fd.functionalDiagnosis
															.description
													}
												</span>
												<br />
											</Fragment>
										)
								)}
								<br />
								<h2
									style={{ marginBottom: "-10px" }}
									className='print-physio-file-data'>
									Početna procjena:
								</h2>
								<br />
								<span
									style={{ fontSize: "20px" }}
									className='print-physio-file-data'>
									{physioFile.assessment.notes}
								</span>
								<br />
								<h2
									style={{ marginBottom: "-10px" }}
									className='print-physio-file-data'>
									Komorbiditeti i operativni postupci:
								</h2>
								<br />
								{physioFile.patient.patientMkbs.map(
									(mkb, index) =>
										index !== 0 && (
											<Fragment>
												<span
													style={{
														fontSize: "20px",
													}}
													className='print-physio-file-data'>
													{mkb.displayName}
												</span>
												<br />
											</Fragment>
										)
								)}
								<br />
								{physioFile.patient.operations &&
									physioFile.patient.operations.map(
										(op, index) => (
											<Fragment key={index}>
												<span
													style={{
														fontSize: "20px",
													}}
													className='print-physio-file-data'>
													{op.procedureName}
												</span>
												<br />
											</Fragment>
										)
									)}
							</div>
							{showHumanBody && (
								<div style={{ width: "40%" }}>
									<div style={{ position: "relative" }}>
										<img
											src={
												physioFile.patient.sex
													.displayName[0] === "F"
													? femaleBodyImage
													: maleBodyImage
											}
											alt='Human body'
											style={{
												maxHeight: "330px",
											}}
										/>
										{physioFile.assessment.pointsOfPain.map(
											(point) => (
												<div
													key={point.id}
													style={{
														position: "absolute",
														left:
															point.x -
															leftMargin,
														top: point.y,
														width: 10,
														height: 10,
														backgroundColor: "red",
														borderRadius: "50%",
													}}
												/>
											)
										)}
									</div>
								</div>
							)}
						</Flex>
						<br />
						<div id='goalsAndPlans' style={{ width: "100%" }}>
							<h2
								style={{ marginBottom: "-10px" }}
								className='print-physio-file-data'>
								Cilj fizioterapije:
							</h2>
							<br />
							{physioFile.patientGoals.map(
								(goal, index) =>
									goal.selected && (
										<Fragment key={index}>
											<span
												style={{
													fontSize: "20px",
												}}
												className='print-physio-file-data'>
												{goal.type}: {goal.description}
											</span>
											<br />
										</Fragment>
									)
							)}
							<br />
							<h2
								style={{ marginBottom: "-10px" }}
								className='print-physio-file-data'>
								Plan fizioterapije:
							</h2>
							<br />
							{physioFile.patientPlans.map(
								(plan, index) =>
									plan.selected && (
										<Fragment key={index}>
											<span
												style={{
													fontSize: "20px",
												}}
												className='print-physio-file-data'>
												{plan.type}: {plan.description}
											</span>
											<br />
										</Fragment>
									)
							)}
						</div>
						<div
							id='noteTestsConclussion'
							style={{ width: "100%" }}>
							{showCpax && (
								<>
									{physioFile.physioTest.cpax.length > 0 &&
										physioFile.physioTest.cpax.length <
											2 && (
											<div style={{ width: "100%" }}>
												<h2
													style={{
														marginBottom: "-10px",
													}}
													className='print-physio-file-data'>
													CPAx:
												</h2>
												<br />
												<div
													className={
														localStyles.cpaxChartContainer
													}>
													<RadarChart
														dateTime={
															findOldestCpax(
																cpaxData
															).dateTimeReturn
														}
														cpax={
															findOldestCpax(
																cpaxData
															).cpaxReturn
														}
													/>
												</div>
											</div>
										)}
									{physioFile.physioTest.cpax.length > 1 && (
										<div style={{ width: "100%" }}>
											<h2
												style={{
													marginBottom: "-10px",
												}}
												className='print-physio-file-data'>
												CPAx:
											</h2>
											<br />
											<div
												className={
													localStyles.cpaxChartContainer
												}>
												<RadarChart
													dateTime={
														findOldestCpax(cpaxData)
															.dateTimeReturn
													}
													cpax={
														findOldestCpax(cpaxData)
															.cpaxReturn
													}
													secondCpaxDefined={true}
													secondCpax={
														findYoungestCpax(
															cpaxData
														).cpaxReturn
													}
													secondCpaxDateTime={
														findYoungestCpax(
															cpaxData
														).dateTimeReturn
													}
												/>
											</div>
										</div>
									)}
								</>
							)}
							{showGcs && (
								<>
									{physioFile.physioTest.gcs.length > 0 && (
										<div style={{ width: "100%" }}>
											<h2
												style={{
													marginBottom: "-10px",
												}}
												className='print-physio-file-data'>
												GCS:
											</h2>
											<br />
											<span
												style={{
													fontSize: "20px",
												}}
												className='print-gcs'>
												{dayjs(
													findOldestGcs(gcsData)
														.oldestDateTimeReturn
														.date
												).format("DD.MM.YYYY.")}{" "}
												- Ukupno:{" "}
												{findOldestGcs(gcsData)
													.oldestGcsReturn
													.eyeResponseAndIndex
													.eyeResponse.score +
													findOldestGcs(gcsData)
														.oldestGcsReturn
														.verbalResponseAndIndex
														.verbalResponse.score +
													findOldestGcs(gcsData)
														.oldestGcsReturn
														.motorResponseAndIndex
														.motorResponse
														.score}{" "}
												(Očna:{" "}
												{
													findOldestGcs(gcsData)
														.oldestGcsReturn
														.eyeResponseAndIndex
														.eyeResponse.score
												}
												, Verbalna:{" "}
												{
													findOldestGcs(gcsData)
														.oldestGcsReturn
														.verbalResponseAndIndex
														.verbalResponse.score
												}
												, Motorička:{" "}
												{
													findOldestGcs(gcsData)
														.oldestGcsReturn
														.motorResponseAndIndex
														.motorResponse.score
												}
												)
											</span>
										</div>
									)}
								</>
							)}
							{showMmt && (
								<>
									{physioFile.physioTest.mmt.length > 0 &&
										physioFile.physioTest.mmt.length <
											2 && (
											<div style={{ width: "100%" }}>
												<h2
													style={{
														marginBottom: "-10px",
													}}
													className='print-physio-file-data'>
													MMT:
												</h2>
												<br />
												<span
													style={{
														fontSize: "20px",
													}}
													className='print-mmt'>
													{dayjs(
														findMmtToDisplay(
															mmtData
														).oldestDateTimeReturn
															.date
													).format("DD.MM.YYYY")}{" "}
													- Ocjena:{" "}
													{
														findMmtToDisplay(
															mmtData
														).oldestMmtReturn
															.gradeAndDescription
															.grade
													}{" "}
													- Zabilješka:{" "}
													{
														findMmtToDisplay(
															mmtData
														).oldestMmtReturn.notes
													}
												</span>
											</div>
										)}
									{physioFile.physioTest.mmt.length > 1 && (
										<div style={{ width: "100%" }}>
											<h2
												style={{
													marginBottom: "-10px",
												}}
												className='print-physio-file-data'>
												MMT:
											</h2>
											<br />
											<span
												style={{
													fontSize: "20px",
												}}
												className='print-mmt'>
												{dayjs(
													findMmtToDisplay(mmtData)
														.oldestDateTimeReturn
														.date
												).format("DD.MM.YYYY")}{" "}
												- Ocjena:{" "}
												{
													findMmtToDisplay(mmtData)
														.oldestMmtReturn
														.gradeAndDescription
														.grade
												}{" "}
												- Zabilješka:{" "}
												{
													findMmtToDisplay(mmtData)
														.oldestMmtReturn.notes
												}
											</span>
											<br />
											<span
												style={{
													fontSize: "20px",
												}}
												className='print-mmt'>
												{dayjs(
													findMmtToDisplay(mmtData)
														.youngestDateTimeReturn
														.date
												).format("DD.MM.YYYY")}{" "}
												- Ocjena:{" "}
												{
													findMmtToDisplay(mmtData)
														.youngestMmtReturn
														.gradeAndDescription
														.grade
												}{" "}
												- Zabilješka:{" "}
												{
													findMmtToDisplay(mmtData)
														.youngestMmtReturn.notes
												}
											</span>
										</div>
									)}
								</>
							)}
							<br />
							<h2
								style={{ marginBottom: "-10px" }}
								className='print-physio-file-data'>
								Zabilješke:
							</h2>
							<br />
							<span
								style={{ fontSize: "20px" }}
								className='print-physio-file-data'>
								{physioFile.notes}
							</span>
							<br />
							<h2
								style={{ marginBottom: "-10px" }}
								className='print-physio-file-data'>
								Završna procjena i zaključak:
							</h2>
							<br />
							<span
								style={{ fontSize: "20px" }}
								className='print-physio-file-data'>
								{physioFile.conclussion}
							</span>
						</div>
						<br />
						{showProcedures && (
							<div style={{ maxWidth: "100%" }}>
								<h2
									style={{ marginBottom: "5px" }}
									className='print-physio-file-data'>
									Procedure:
								</h2>
								<table className={localStyles.styledTable}>
									<thead>
										<tr>
											<th
												className={
													localStyles.styledTableHeader
												}>
												Datum
											</th>
											<th
												className={
													localStyles.styledTableHeader
												}>
												Procedura
											</th>
										</tr>
									</thead>
									<tbody>
										{physioFile.patientProcedures.map(
											(procedure, index) => (
												<tr key={index}>
													<td
														className={
															localStyles.styledTableCell
														}>
														{new Date(
															Date.parse(
																procedure.dateTime
															)
														)
															.toLocaleDateString(
																"hr-HR",
																dateOptions
															)
															.split(" ")
															.join("")}
													</td>
													<td
														className={
															localStyles.styledTableCell
														}>
														{procedure.description}
													</td>
												</tr>
											)
										)}
									</tbody>
								</table>
							</div>
						)}
					</div>
				</Flex>
			</div>
			<hr className={localStyles.splitterLine} />
			<div
				id='therapeutPrinting'
				className={`${localStyles.therapeut} print-therapeut`}>
				<span style={{ fontSize: "20px" }}>
					{currentPhysio.sex.toLowerCase()[0] === "m"
						? "Fizioterapeut"
						: "Fizioterapeutkinja"}
					:
				</span>
				<br />
				<h2 style={{ marginTop: "-20px" }} className='print-therapeut'>
					{currentPhysio.firstName} {currentPhysio.lastName},{" "}
					{currentPhysio.title}
				</h2>
			</div>
			<div id='dateOfPrinting' className={localStyles.dateOfPrinting}>
				<h2 className='print-date-of-print'>Datum izdavanja:</h2>
				<span
					style={{ marginLeft: "10px", fontSize: "20px" }}
					className='print-date-of-print'>
					{new Date(Date.now())
						.toLocaleDateString("hr-HR", dateOptions)
						.split(" ")
						.join("")}
				</span>
			</div>
		</div>
	);
};

Printing.defaultProps = {
	showProcedures: true,
	showHumanBody: true,
	showCpax: false,
	showGcs: false,
	showMmt: false,
};

export default Printing;
