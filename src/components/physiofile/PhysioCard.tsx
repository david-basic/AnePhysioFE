import { Col, Row } from "antd";
import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import { type PhysioFileVM } from "../../models/physiofile/PhysioFileVM";

type PhysioCardProps = {
	physioFile: PhysioFileVM;
	isLoading: boolean;
};

const PhysioCard: FC<PhysioCardProps> = ({
	isLoading,
	physioFile,
}: PhysioCardProps) => {
	const navigate = useNavigate();

	return (
		<>
			{isLoading && <LoadingSpinner />}
			{!isLoading && (
				<>
					<Row>
						<Col></Col>
					</Row>
				</>
			)}
		</>
	);
};

export default PhysioCard;

/* <Row>
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
</Row> */
