import { type FC } from "react";
import { useAppDispatch } from "../../hooks/use_app_dispatch";
import { modalsShowActions } from "../../store/modals-show-slice";
import { Modal, message } from "antd";
import { useAppSelector } from "../../hooks/use_app_selector";
import { physioFileActions } from "../../store/physio-file-slice";

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

		dispatch(physioFileActions.setDataSaved(true));
		message.success("Fizioterapeutski karton spremljen!")
		dispatch(modalsShowActions.setShowSaveModal(false));
	};

	return (
		<Modal
			title='Potvrda spremanja'
			centered
			open={showSaveModal}
			onOk={handleModalOk}
			okText='Spremi'
			cancelText='Odustani'
			okButtonProps={{ color: "#286e34" }}
			onCancel={() =>
				dispatch(modalsShowActions.setShowSaveModal(false))
			}>
			<h2>
				Želite li spremiti podatke na kartonu?
			</h2>
		</Modal>
	);
};

export default ConfirmSavePhysioFileModal;
