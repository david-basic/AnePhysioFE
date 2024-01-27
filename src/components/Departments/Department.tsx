import { type FC } from "react";
import { type DepartmentVM } from "../../models/department/DepartmentVM";
import { Row } from "antd";
import Box from "./Box";

const Department: FC<DepartmentVM> = (props: DepartmentVM) => {
	return (
		<>
			<Row justify={"space-evenly"}>
				{props.boxes.map((box) => (
					<Box
						key={box.id}
						id={box.id}
						beds={box.beds}
						name={box.name}
					/>
				))}
			</Row>
		</>
	);
};

export default Department;
