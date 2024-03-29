import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import Layout, { Content, Header } from "antd/es/layout/layout";
import localStyles from "./PrintingPage.module.css";
import Printing from "../../components/printing/Printing";
import { Button, Flex, Tooltip } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import TestsButton from "../../components/physiofile/physioTests/TestsButton";
import { PrinterFill } from "react-bootstrap-icons";
import { useAppSelector } from "../../hooks/use_app_selector";
import { type DepartmentVM } from "../../models/department/DepartmentVM";
import PrintButton from "../../components/printing/PrintButton";

const PrintingPage: FC = () => {
	const navigate = useNavigate();
	const [showProcedures, setShowProcedures] = useState<boolean>(true);
	const [showHumanBody, setShowHumanBody] = useState<boolean>(true);
	const [showCpax, setShowCpax] = useState<boolean>(false);
	const [showMmt, setShowMmt] = useState<boolean>(false);
	const [showGcs, setShowGcs] = useState<boolean>(false);
	const { jilRIjeka, jilSusak, crc, kardioJil } = useAppSelector(
		(state) => state.deptLocalitiesReducer
	);
	const physioFile = useAppSelector(
		(state) => state.physioFileReducer.currentPhysioFile
	);
	const currentPhysio = useAppSelector((state) => state.authReducer.user);

	const handlePrint = () => {
		window.print();
	};

	const findPatientsDepartment = (): DepartmentVM => {
		if (physioFile.departmentId === jilRIjeka.id) {
			return jilRIjeka;
		} else if (physioFile.departmentId === jilSusak.id) {
			return jilSusak;
		} else if (physioFile.departmentId === crc.id) {
			return crc;
		} else if (physioFile.departmentId === kardioJil.id) {
			return kardioJil;
		}

		return {
			id: "",
			name: "Nepoznato odjeljenje",
			locality: {
				id: "",
				name: "Nepoznata lokacija",
				displayName: "Nepoznata lokacija",
			},
			boxes: [],
			shorthand: "N/A",
		};
	};

	return (
		<>
			<Header
				style={{
					backgroundColor: "#023f81",
					position: "fixed",
				}}
				className={localStyles.fileheader}>
				<Flex
					vertical={false}
					style={{
						height: "inherit",
						fontFamily: "Nunito, sans-serif",
					}}>
					<div style={{ width: "5%" }}>
						<Tooltip
							title='Povratak na fizioterapeutski karton'
							color='#045fbd'>
							<Button
								type='text'
								style={{
									margin: "20px 10px 10px",
									width: "50px",
									height: "50px",
									color: "white",
								}}
								icon={<ArrowLeftOutlined />}
								onClick={() => navigate(-1)}
							/>
						</Tooltip>
					</div>
					<div
						style={{ width: "60%" }}
						className={localStyles.stacking}>
						<Flex vertical={false} gap={10}>
							<PrintButton
								toggledOff
								label='CPAx'
								onClick={() => setShowCpax(!showCpax)}
							/>
							<PrintButton
								toggledOff
								label='GCS'
								onClick={() => setShowGcs(!showGcs)}
							/>
							<PrintButton
								toggledOff
								label='MMT'
								onClick={() => setShowMmt(!showMmt)}
							/>
							<PrintButton
								label='Procedure'
								onClick={() =>
									setShowProcedures(!showProcedures)
								}
							/>
							<PrintButton
								label='Tijelo'
								onClick={() => setShowHumanBody(!showHumanBody)}
							/>
							<TestsButton
								label='Ispiši'
								onClick={handlePrint}
								icon={<PrinterFill />}
							/>
						</Flex>
					</div>
					<div style={{ width: "20%" }}></div>
					<div
						style={{ width: "15%" }}
						className={localStyles.titleText}>
						<span>ISPIS</span> <br />
						<span>KARTONA</span>
					</div>
				</Flex>
			</Header>
			<Layout>
				<Layout>
					<Content
						className={localStyles.filecontent}
						style={{ backgroundColor: "#d1f2ff" }}>
						<Printing
							physioFile={physioFile}
							currentPhysio={currentPhysio}
							patientDepartment={findPatientsDepartment()}
							showProcedures={showProcedures}
							showHumanBody={showHumanBody}
							showCpax={showCpax}
							showMmt={showMmt}
							showGcs={showGcs}
						/>
					</Content>
				</Layout>
			</Layout>
		</>
	);
};

export default PrintingPage;
