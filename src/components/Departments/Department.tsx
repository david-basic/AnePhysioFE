import { type FC } from "react";
import Box from "./Box";
import { DepartmentVM } from "../../models/department/DepartmentVM";
import { Row } from "antd";
import styles from "./Department.module.css";

const Department: FC<DepartmentVM> = (props: DepartmentVM) => {
	return (
		<>
			<Row
				justify={"space-evenly"}
				className={styles['departments-in-row']}>
				{props.boxes.map((box) => (
					<Box key={box.id} id={box.id} beds={box.beds} name={box.name} />
				))}
			</Row>
		</>
	);
};

export default Department;
