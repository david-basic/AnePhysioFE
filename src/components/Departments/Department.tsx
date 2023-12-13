import { type FC } from "react";
import Box from "./Box";
import { DepartmentVM } from "../../models/DepartmentVM";
import { Row } from "antd";

const Department: FC<DepartmentVM> = (props: DepartmentVM) => {
	return (
		<>
			<Row
				justify={"space-evenly"}
				style={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
				}}>
				{props.boxes.map((box) => (
					<Box key={box.id} id={box.id} beds={box.beds} name={box.name} />
				))}
			</Row>
		</>
	);
};

export default Department;
