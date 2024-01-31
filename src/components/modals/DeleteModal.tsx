import { type FC } from "react";
import useFetcApihWithTokenRefresh from "../../hooks/use_fetch_api_with_token_refresh";
import { Modal, message } from "antd";
import { type ApiResponse } from "../../type";
import { HttpStatusCode } from "axios";
import modalStyles from "./ModalStyles.module.css";

type DeleteModalProps = {
	url: string;
	isVisible: boolean;
	setVisible: (newState: boolean) => void;
	setDeleted: (newState: boolean) => void;
	body?: any;
};

const DeleteModal: FC<DeleteModalProps> = ({
	url,
	isVisible,
	setVisible,
	setDeleted,
	body
}: DeleteModalProps) => {
	const { fetchWithTokenRefresh: sendRequest } =
		useFetcApihWithTokenRefresh();

	const handleCancel = () => {
		setVisible(false);
	};

	const sendDeleteRequest = (url: string) => {
		sendRequest(
			{
				url: url,
				method: "DELETE",
				body: body ? body : null,
			},
			(deleteResponseData: ApiResponse<any>) => {
				//TODO change from any to whatever the standardized response of deleting object you will have
				if (deleteResponseData.status !== HttpStatusCode.Ok) {
					//TODO you might be returning another status on deletion change that here!
					message.error(deleteResponseData.message);
				} else {
					message.info(deleteResponseData.message);
					setVisible(false);
					setDeleted(true);
				}
			}
		);
	};

	return (
		<Modal
			open={isVisible}
			onOk={() => {
				sendDeleteRequest(url);
			}}
			className={modalStyles.modalsGeneral}
			onCancel={handleCancel}>
			<h2>Brisanje</h2>
			<p>Molimo vas potvrdite brisanje!</p>
		</Modal>
	);
};

export default DeleteModal;
