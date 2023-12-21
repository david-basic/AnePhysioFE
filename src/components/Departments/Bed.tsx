import { type FC } from "react";
import { type BedVM } from "../../models/BedVM";
import { Link } from "react-router-dom";
import styles from "./Bed.module.css";
import { Col, Row } from "antd";
import { Trash } from "react-bootstrap-icons";

type BedProps = {
	bedNum: number;
} & BedVM;

const Bed: FC<BedProps> = ({ bedNum, patient }: BedProps) => {
	const dataToTransfer = {
		id: patient !== null ? patient!.id : null,
	};

	return (
		<Row>
			<Col span={22}>
				{patient !== null && (
					<Link
						to={"#linkToAPage"}
						className={styles["occupied-bed-text"]}
						state={dataToTransfer}>
						{`Bed ${bedNum}: ${
							patient!.firstName + " " + patient!.lastName
						}`}
					</Link>
				)}
				{patient === null && (
					<p
						className={
							styles["free-bed-text"]
						}>{`Bed ${bedNum}: empty bed`}</p>
				)}
			</Col>
            <Col span={2}>
                {patient === null && <Trash className="text-danger" />}
            </Col>
		</Row>
	);
};

export default Bed;
