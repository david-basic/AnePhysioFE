import { type FC } from "react";
import { type BoxVM } from "../../models/department/BoxVM";
import localStyles from "./Box.module.css";
import { ListGroup } from "react-bootstrap";
import Bed from "./Bed";
import { Header } from "antd/es/layout/layout";
import CustomCard, { CustomCardProps } from "../CustomCard";

type BoxProps = {
	index: number;
	departmentName: string;
	departmentShorthand: string;
} & Omit<BoxVM, "id"> & Omit<CustomCardProps, "children">;

const Box: FC<BoxProps> = ({
	name,
	beds,
	departmentName,
	index,
	departmentShorthand,
	...customCardProps
}: BoxProps) => {
	return (
		<CustomCard {...customCardProps}>
			<Header className={localStyles.cardHeader}>
				<span className={localStyles.cardTitle}>{name}</span>
			</Header>
			<ListGroup variant='flush' style={{marginTop: "30px"}}>
				{beds.map((bed) => (
					<ListGroup.Item key={bed.id} id={bed.patient?.id}>
						<Bed
							key={bed.id}
							id={bed.id}
							patient={bed.patient}
							bedIsEmpty={bed.bedIsEmpty}
							departmentName={departmentName}
						/>
					</ListGroup.Item>
				))}
			</ListGroup>
		</CustomCard>
	);
};

export default Box;
