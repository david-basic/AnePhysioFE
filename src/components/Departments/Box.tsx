import { Card } from "antd";
import { type FC } from "react";
import { type BoxVM } from "../../models/department/BoxVM";
import styles from "./Box.module.css";
import { ListGroup } from "react-bootstrap";
import { PlusLg, Trash } from "react-bootstrap-icons";
import Bed from "./Bed";

const Box: FC<BoxVM> = (props: BoxVM) => {
	let bedNumber = 1;
	return (
		<Card
			title={props.name}
			className={styles.card}
			actions={[
				<PlusLg key={`addBox${props.name}Bed`} href='#' />,
				props.beds.length === 0 &&
				<Trash
					key={`deleteBox${props.name}`}
					href='#'
				/>,
			]}>
			<ListGroup variant='flush'>
				{props.beds.map((bed) => (
					<ListGroup.Item key={bed.id} id={bed.patient?.id}>
						<Bed
							key={bed.id}
							bedNum={bedNumber++}
							id={bed.id}
							patient={bed.patient}
						/>
					</ListGroup.Item>
				))}
			</ListGroup>
		</Card>
	);
};

export default Box;
