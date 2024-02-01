import { useState, type FC } from "react";
import { type PhysioFileVM } from "../../../models/physiofile/PhysioFileVM";
import femaleBodyImage from "../../../assets/female-01.png";
import maleBodyImage from "../../../assets/male-01.png";
import generateRandomNumber from "../../../util/generateRandomBigInteger";
import { SaveFilled } from "@ant-design/icons";
import { Button, Row, message } from "antd";
import modalStyles from "../../modals/ModalStyles.module.css";
import api_routes from "../../../config/api_routes";
import { useAppDispatch } from "../../../hooks/use_app_dispatch";
import useFetcApihWithTokenRefresh from "../../../hooks/use_fetch_api_with_token_refresh";
import { physioFileActions } from "../../../store/physio-file-slice";
import { ApiResponse } from "../../../type";
import { HttpStatusCode } from "axios";
import { Point } from "../../../models/physiofile/assessment/Point";
import { CreateOrUpdatePointsRequestDto } from "../../../dto/PhysioFile/Assessment/CreateOrUpdatePointsRequestDto";

type HumanBodyProps = {
	physioFile: PhysioFileVM;
	initialPoints?: Point[];
};

const HumanBody: FC<HumanBodyProps> = ({
	physioFile,
	initialPoints = [],
}: HumanBodyProps) => {
	const dispatch = useAppDispatch();
	const { fetchWithTokenRefresh } = useFetcApihWithTokenRefresh();
	const [points, setPoints] = useState<Point[]>(initialPoints);
	const [pointsSaved, setPointsSaved] = useState<boolean>(true);
	const leftMargin = 150;

	const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
		const boundingBox = event.currentTarget.getBoundingClientRect();
		const x = event.clientX - boundingBox.left - 5 + leftMargin; //5 is how much the point generated is offset from the mouse click center
		const y = event.clientY - boundingBox.top - 5;

		const clickedPoint = points.find(
			(point) =>
				x >= point.x &&
				x <= point.x + 10 &&
				y >= point.y &&
				y <= point.y + 10
		);

		if (clickedPoint) {
			const updatedPoints = points.filter(
				(point) => point.id !== clickedPoint.id
			);
			setPoints(updatedPoints);
		} else {
			const id = generateRandomNumber(12)!;
			setPoints([...points, { id, x, y }]);
		}

		setPointsSaved(false);
	};

	const handleSaveChoice = () => {
		const createOrUpdateDto: CreateOrUpdatePointsRequestDto = {
			physioFileId: physioFile.id,
			pointsOfPain: points.map((point) => ({
				id: "",
				x: point.x,
				y: point.y,
			})),
		};

		try {
			fetchWithTokenRefresh(
				{
					url:
						api_routes.ROUTE_ASSESSMENT_UPDATE_POINTS_OF_PAIN_BY_ID +
						`/${physioFile.assessment.id}`,
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: createOrUpdateDto,
				},
				(physioFileResponse: ApiResponse<PhysioFileVM>) => {
					if (physioFileResponse.status !== HttpStatusCode.Ok) {
						message.error("Nije moguće spremiti nove točke!");
						console.error(
							"There was a error while saving new pain points: ",
							physioFileResponse
						);
					} else {
						dispatch(
							physioFileActions.setPhysioFile(
								physioFileResponse.data!
							)
						);
						message.success("Nove točke boli uspješno spremljene!");
						setPointsSaved(true);
					}
				}
			);
		} catch (error) {
			console.error("Error posting new paint points:", error);
			message.error("Neuspjelo spremanje točaka boli!");
		}
	};

	return (
		<>
			<div style={{ position: "relative" }}>
				<img
					src={
						physioFile.patient.sex.displayName[0] === "F"
							? femaleBodyImage
							: maleBodyImage
					}
					alt='Human body'
					onClick={handleImageClick}
					style={{
						maxHeight: "630px",
						marginLeft: `${leftMargin}px`,
						cursor: "crosshair",
						borderRadius: "8px",
					}}
				/>
				{points.map((point) => (
					<div
						key={point.id}
						style={{
							position: "absolute",
							left: point.x,
							top: point.y,
							width: 10,
							height: 10,
							backgroundColor: "red",
							borderRadius: "50%",
							cursor: "pointer",
						}}
						onClick={() => {
							const updatedPoints = points.filter(
								(p) => p.id !== point.id
							);
							setPoints(updatedPoints);
							setPointsSaved(false);
						}}
					/>
				))}
			</div>
			<Row align='middle'>
				<Button
					type='primary'
					shape='round'
					className={modalStyles.modalsButtons}
					icon={<SaveFilled />}
					disabled={pointsSaved}
					onClick={handleSaveChoice}>
					Spremi odabir
				</Button>
			</Row>
		</>
	);
};

export default HumanBody;
