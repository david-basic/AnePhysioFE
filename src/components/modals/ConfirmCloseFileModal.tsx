import { FC } from "react";
import { PhysioFileVM } from "../../models/physiofile/PhysioFileVM";
import useFetcApihWithTokenRefresh from "../../hooks/use_fetch_api_with_token_refresh";
import { useAppDispatch } from "../../hooks/use_app_dispatch";
import { Modal, message } from "antd";
import modalStyles from "./ModalStyles.module.css";
import { modalsShowActions } from "../../store/modals-show-slice";
import api_routes from "../../config/api_routes";
import { useAppSelector } from "../../hooks/use_app_selector";
import { CloseFileRequestDto } from "../../dto/PhysioFile/CloseFileRequestDto";
import { ApiResponse } from "../../type";
import { HttpStatusCode } from "axios";
import { physioFileActions } from "../../store/physio-file-slice";

type ConfirmCloseFileModalProps = {
	showCloseFileModal: boolean;
	physioFile: PhysioFileVM;
};

const ConfirmCloseFileModal: FC<ConfirmCloseFileModalProps> = ({
	physioFile,
	showCloseFileModal,
}: ConfirmCloseFileModalProps) => {
	const dispatch = useAppDispatch();
	const { fetchWithTokenRefresh } = useFetcApihWithTokenRefresh();
	const currentTherapist = useAppSelector((state) => state.authReducer.user);

	const handleModalOk = () => {
		const updateDto: CloseFileRequestDto = {
			therapistId: currentTherapist.id,
		};

		try {
			fetchWithTokenRefresh(
				{
					url:
						api_routes.ROUTE_PHYSIO_FILE_CLOSE_FILE_BY_ID +
						`/${physioFile.id}`,
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: updateDto,
				},
				(physioFileResponse: ApiResponse<PhysioFileVM>) => {
					if (physioFileResponse.status !== HttpStatusCode.Ok) {
						message.error(
							"Nije moguće zatvoriti fizioterapeutski karton!"
						);
						console.error(
							"There was a error while closing physio file: ",
							physioFileResponse
						);
					} else {
						dispatch(
							physioFileActions.setCurrentPhysioFile(
								physioFileResponse.data!
							)
						);
						dispatch(
							physioFileActions.setPhysioFileDataSaved(true)
						);
						message.success(
							"Fizioterapeutski karton uspješno zatvoren!"
						);
					}
				}
			);
		} catch (error) {
			console.error("Error closing physio file:", error);
			message.error("Neuspjelo zatvaranje fizioterapeutskog kartona!");
		}

		dispatch(modalsShowActions.setShowCloseFileModal(false));
	};

	return (
		<Modal
			centered
			open={showCloseFileModal}
			onOk={handleModalOk}
			okText='Zaključaj karton'
			cancelText='Odustani'
			className={modalStyles.modalsGeneral}
			okButtonProps={{
				className: `${modalStyles.modalsButtons}`,
			}}
			cancelButtonProps={{ className: `${modalStyles.modalsButtons}` }}
			onCancel={() =>
				dispatch(modalsShowActions.setShowCloseFileModal(false))
			}>
			<h2>Potvrda zaključavanja</h2>
			<h3>
				Želite li zaključati karton?<br />Nakon zaključavanja više
				neće biti moguće raditi izmjene na kartonu!<br />Sve ne spremljene
				izmjene biti će izgubljene!
			</h3>
		</Modal>
	);
};

export default ConfirmCloseFileModal;
