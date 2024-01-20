import { type FC } from "react";
import { useAppDispatch } from "../../hooks/use_app_dispatch";
import { modalsShowActions } from "../../store/modals-show-slice";
import { Modal, message } from "antd";
import { useAppSelector } from "../../hooks/use_app_selector";
import { physioFileActions } from "../../store/physio-file-slice";
import modalStyles from "./ModalStyles.module.css";

type ConfirmSaveModalProps = {
	showSaveModal: boolean;
};

const ConfirmSavePhysioFileModal: FC<ConfirmSaveModalProps> = ({
	showSaveModal,
}: ConfirmSaveModalProps) => {
	const dispatch = useAppDispatch();
	const physioFile = useAppSelector(
		(state) => state.physioFileReducer.physioFile
	);

	const handleModalOk = () => {
		dispatch(physioFileActions.setPhysioFile(physioFile));

		//TODO do a call to API to save the data to backend

		sessionStorage.setItem("physioPageLoadedOnce", "false");
		dispatch(physioFileActions.setPhysioFileDataSaved(true));
		message.success("Fizioterapeutski karton spremljen!");
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
			<h1>Potvrda spremanja</h1>
			<h2>Želite li spremiti podatke na kartonu?</h2>
		</Modal>
	);
};

export default ConfirmSavePhysioFileModal;
