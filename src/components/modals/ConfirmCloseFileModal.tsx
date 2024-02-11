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
import { UpdatePhysioFileRequestDto } from "../../dto/PhysioFile/UpdatePhysioFileRequestDto";

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
		const {
			patientFunctionalDiagnoses,
			assessment,
			patientGoals,
			patientPlans,
			notes,
			conclussion,
		}: PhysioFileVM = physioFile;

		const updatePhysioFileDto: UpdatePhysioFileRequestDto = {
			patientFunctionalDiagnoses,
			assessmentNotes: assessment.notes,
			patientGoals,
			patientPlans,
			notes,
			conclussion,
		};

		const closeFileDto: CloseFileRequestDto = {
			therapistId: currentTherapist.id,
		};

		try {
			fetchWithTokenRefresh(
				{
					url:
						api_routes.ROUTE_PHYSIO_FILE_UPDATE_BY_ID +
						`/${physioFile.id}`,
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: updatePhysioFileDto,
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

						try {
							fetchWithTokenRefresh(
								{
									url:
										api_routes.ROUTE_PHYSIO_FILE_CLOSE_FILE_BY_ID +
										`/${physioFile.id}`,
									method: "PUT",
									headers: {
										"Content-Type": "application/json",
									},
									body: closeFileDto,
								},
								(
									physioFileResponse: ApiResponse<PhysioFileVM>
								) => {
									if (
										physioFileResponse.status !==
										HttpStatusCode.Ok
									) {
										message.error(
											"Nije moguće zatvoriti fizioterapeutski karton!"
										);
										message.error(
											physioFileResponse.message
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
											physioFileActions.setPhysioFileDataSaved(
												true
											)
										);
										message.success(
											"Fizioterapeutski karton uspješno zatvoren!"
										);
									}
								}
							);
						} catch (error) {
							console.error("Error closing physio file:", error);
							message.error(
								"Neuspjelo zatvaranje fizioterapeutskog kartona!"
							);
						}
					}
				}
			);
		} catch (error) {
			console.error("Error saving physio file:", error);
			message.error("Neuspjelo spremanje fizioterapeutskog kartona!");
		}

		dispatch(modalsShowActions.setShowCloseFileModal(false));
	};

	return (
		<Modal
			centered
			open={showCloseFileModal}
			onOk={handleModalOk}
			okText='Spremi i Zaključi karton'
			cancelText='Odustani'
			className={modalStyles.modalsGeneral}
			okButtonProps={{
				className: `${modalStyles.modalsButtons}`,
			}}
			cancelButtonProps={{ className: `${modalStyles.modalsButtons}` }}
			onCancel={() =>
				dispatch(modalsShowActions.setShowCloseFileModal(false))
			}>
			<h3>
				Želite li zaključiti karton?
				<br />
				Nakon zaključivanja više neće biti moguće raditi izmjene na
				kartonu!
			</h3>
		</Modal>
	);
};

export default ConfirmCloseFileModal;
