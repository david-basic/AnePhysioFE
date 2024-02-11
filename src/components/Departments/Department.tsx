import { type FC } from "react";
import { type DepartmentVM } from "../../models/department/DepartmentVM";
import { Col, Row } from "antd";
import Box from "./Box";
import { Header } from "antd/es/layout/layout";
import localStyles from "./Department.module.css";

const Department: FC<DepartmentVM> = ({
	id: departmentId,
	boxes: departmentBoxes,
	name: departmentName,
	shorthand: departmentShorthand,
	locality: departmentLocality,
}: DepartmentVM) => {
	return (
		<div className={localStyles.departmentContainer}>
			{departmentShorthand === "JIL Rijeka" && (
				<>
					<Header className={localStyles.header}>
						<span className={localStyles.headerTitle}>
							{departmentName}
						</span>
					</Header>
					<Row justify={"center"}>
						<Col>
							{departmentBoxes.map(
								(box, index) =>
									(index === 0 || index === 2) && (
										<Box
											className={
												index === 0
													? localStyles.rijekaBox1
													: localStyles.rijekaIzolacija
											}
											key={box.id}
											index={index}
											departmentName={departmentName}
											departmentShorthand={
												departmentShorthand
											}
											beds={box.beds}
											name={box.name}
										/>
									)
							)}
						</Col>
						<Col>
							{departmentBoxes.map(
								(box, index) =>
									(index === 1 || index === 3) && (
										<Box
											className={
												index === 1
													? localStyles.rijekaBox2
													: localStyles.rijekaSepticni
											}
											key={box.id}
											index={index}
											departmentName={departmentName}
											departmentShorthand={
												departmentShorthand
											}
											beds={box.beds}
											name={box.name}
										/>
									)
							)}
						</Col>
					</Row>
				</>
			)}

			{departmentShorthand === "JIL Sušak" && (
				<>
					<Header className={localStyles.header}>
						<span className={localStyles.headerTitle}>
							{departmentName}
						</span>
					</Header>
					<Row align={"middle"} justify={"center"}>
						<Col className={localStyles.leftSusakCol}>
							{departmentBoxes.map(
								(box, index) =>
									index === 0 && (
										<Box
											className={localStyles.susakOpci}
											key={box.id}
											index={index}
											departmentName={departmentName}
											departmentShorthand={
												departmentShorthand
											}
											beds={box.beds}
											name={box.name}
										/>
									)
							)}
						</Col>
						<Col className={localStyles.rightSusakCol}>
							{departmentBoxes.map(
								(box, index) =>
									index > 0 && (
										<Box
											className={
												index === 1
													? localStyles.susakIzolacija
													: localStyles.susakSepticni
											}
											key={box.id}
											index={index}
											departmentName={departmentName}
											departmentShorthand={
												departmentShorthand
											}
											beds={box.beds}
											name={box.name}
										/>
									)
							)}
						</Col>
					</Row>
				</>
			)}
			{departmentShorthand === "Kardio JIL" && (
				<>
					<Header className={localStyles.header}>
						<span className={localStyles.headerTitle}>
							{departmentName}
						</span>
					</Header>
					<Row align={"middle"} justify={"center"}>
						{departmentBoxes.map((box, index) => (
							<Box
								className={localStyles.kardioBox}
								key={box.id}
								index={index}
								departmentName={departmentName}
								departmentShorthand={departmentShorthand}
								beds={box.beds}
								name={box.name}
							/>
						))}
					</Row>
				</>
			)}
			{departmentShorthand === "CRC" && (
				<>
					<Header className={localStyles.header}>
						<span className={localStyles.headerTitle}>
							{departmentName}
						</span>
					</Header>
					<Row align={"middle"}>
						<Row
							justify={"center"}
							className={localStyles.firstCrcRow}>
							{departmentBoxes.map(
								(box, index) =>
									index === 0 && (
										<Box
											className={localStyles.crcBox1}
											key={box.id}
											index={index}
											departmentName={departmentName}
											departmentShorthand={
												departmentShorthand
											}
											beds={box.beds}
											name={box.name}
										/>
									)
							)}
						</Row>
						<Row
							justify={"center"}
							className={localStyles.secondCrcRow}>
							{departmentBoxes.map(
								(box, index) =>
									index > 0 && (
										<Box
											className={
												index === 1
													? localStyles.crcIzolacija
													: localStyles.crcSepticni
											}
											key={box.id}
											index={index}
											departmentName={departmentName}
											departmentShorthand={
												departmentShorthand
											}
											beds={box.beds}
											name={box.name}
										/>
									)
							)}
						</Row>
					</Row>
				</>
			)}
		</div>
	);
};

export default Department;
