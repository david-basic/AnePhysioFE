import { type FC } from "react";
import { useAppDispatch } from "../../hooks/use_app_dispatch";
import { modalsShowActions } from "../../store/modals-show-slice";
import { Modal, message } from "antd";
import { physioFileActions } from "../../store/physio-file-slice";
import modalStyles from "./ModalStyles.module.css";
import useFetcApihWithTokenRefresh from "../../hooks/use_fetch_api_with_token_refresh";
import api_routes from "../../config/api_routes";
import { PhysioFileVM } from "../../models/physiofile/PhysioFileVM";
import { ApiResponse } from "../../type";
import { HttpStatusCode } from "axios";
import { UpdatePhysioFileRequestDto } from "../../dto/PhysioFile/UpdatePhysioFileRequestDto";

type ConfirmSaveModalProps = {
	showSaveModal: boolean;
	physioFile: PhysioFileVM;
};

const ConfirmSavePhysioFileModal: FC<ConfirmSaveModalProps> = ({
	showSaveModal,
	physioFile,
}: ConfirmSaveModalProps) => {
	const dispatch = useAppDispatch();
	const { fetchWithTokenRefresh } = useFetcApihWithTokenRefresh();

	const handleModalOk = () => {
		const {
			patientFunctionalDiagnoses,
			assessment,
			patientGoals,
			patientPlans,
			notes,
			conclussion,
		}: PhysioFileVM = physioFile;

		const updateDto: UpdatePhysioFileRequestDto = {
			patientFunctionalDiagnoses,
			assessmentNotes: assessment.notes,
			patientGoals,
			patientPlans,
			notes,
			conclussion,
		};

		try {
			fetchWithTokenRefresh(
				{
					url:
						api_routes.ROUTE_PHYSIO_FILE_UPDATE_BY_ID +
						`/${physioFile.id}`,
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: updateDto,
				},
				(physioFileResponse: ApiResponse<PhysioFileVM>) => {
					if (physioFileResponse.status !== HttpStatusCode.Ok) {
						message.error(
							"Nije moguće spremiti fizioterapeutski karton!"
						);
						message.error(physioFileResponse.message);
						console.error(
							"There was a error while saving physio file: ",
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
							"Fizioterapeutski karton uspješno spremljen!"
						);
					}
				}
			);
		} catch (error) {
			console.error("Error saving physio file:", error);
			message.error("Neuspjelo spremanje fizioterapeutskog kartona!");
		}

		dispatch(modalsShowActions.setShowSaveModal(false));
	};

	return (
		<Modal
			centered
			open={showSaveModal}
			onOk={handleModalOk}
			okText='Spremi'
			cancelText='Odustani'
			className={modalStyles.modalsGeneral}
			okButtonProps={{
				className: `${modalStyles.modalsButtons}`,
			}}
			cancelButtonProps={{ className: `${modalStyles.modalsButtons}` }}
			onCancel={() =>
				dispatch(modalsShowActions.setShowSaveModal(false))
			}>
			<h2>Potvrda spremanja</h2>
			<h3>Želite li spremiti podatke na kartonu?</h3>
		</Modal>
	);
};

export default ConfirmSavePhysioFileModal;
