import { Modal } from "antd";
import { type FC } from "react";
import { useAppDispatch } from "../../hooks/use_app_dispatch";
import { modalsShowActions } from "../../store/modals-show-slice";
import { useNavigate } from "react-router-dom";
import { physioFileActions } from "../../store/physio-file-slice";
import modalStyles from "./ModalStyles.module.css";

type ConfirmLeaveModalProps = {
	showLeaveModal: boolean;
	navigateTo?: string;
};

const ConfirmLeavePhysioFileModal: FC<ConfirmLeaveModalProps> = ({
	showLeaveModal,
	navigateTo,
}: ConfirmLeaveModalProps) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const handleModalOk = (event: any) => {
		event.preventDefault();

		dispatch(modalsShowActions.setShowLeaveModal(false));
		dispatch(physioFileActions.setDataSaved(true));
		dispatch(physioFileActions.resetPhysioFileToInitValues());
		sessionStorage.setItem("loadedOnce", "false");

		navigateTo ? navigate(navigateTo) : navigate(-1);
	};

	return (
		<Modal
			centered
			open={showLeaveModal}
			onOk={handleModalOk}
			okText='Izlaz'
			okType='danger'
			className={modalStyles.modalsGeneral}
			cancelText='Odustani'
			okButtonProps={{
				type: "primary",
				className: `${modalStyles.modalsButtons}`,
			}}
			cancelButtonProps={{ className: `${modalStyles.modalsButtons}` }}
			onCancel={() =>
				dispatch(modalsShowActions.setShowLeaveModal(false))
			}>
			<h2>Želite li izaći iz fizioterapeutskog kartona?</h2>
			<h3>Sve nespremljene promjene biti će izgubljene!</h3>
		</Modal>
	);
};

export default ConfirmLeavePhysioFileModal;
