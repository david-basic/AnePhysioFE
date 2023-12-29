import { Button, Col, Row } from "antd";
import { type FC } from "react";
import { CaretLeftSquare } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import styles from "./PhysioCard.module.css";

type PhysioCardProps = {
	patientId: string;
	isLoading: boolean;
};

const PhysioCard: FC<PhysioCardProps> = ({
	isLoading,
	patientId,
}: PhysioCardProps) => {
	const navigate = useNavigate();

	return (
		<>
			{isLoading && <LoadingSpinner />}
			{!isLoading && (
				<>
					<Row>
						<Col className={styles["back-button-position"]}>
							<Button
								type='link'
								size='large'
								icon={
									<CaretLeftSquare
										width='35px'
										height='35px'
									/>
								}
								onClick={() => {
									navigate(-1);
								}}
							/>
						</Col>
					</Row>
					<Row>
						<Col>
							<h2>Patient Page!</h2>
							<h3>Patient id: {patientId}</h3>
						</Col>
					</Row>
				</>
			)}
		</>
	);
};

export default PhysioCard;
