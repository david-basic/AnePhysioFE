import { type FC } from "react";
import localStyles from "./RassModal.module.css";
import fileStyles from "../PhysioFile.module.css";
import { type PatientRassVM } from "../../../models/physiofile/assessment/PatientRassVM";
import { useAppDispatch } from "../../../hooks/use_app_dispatch";
import { modalsShowActions } from "../../../store/modals-show-slice";
import { ConfigProvider, Modal } from "antd"; 
import "./test.css";

type RassModalProps = {
	showModal: boolean;
	patientRassTests: PatientRassVM[];
};

const RassModal: FC<RassModalProps> = ({
	showModal,
	patientRassTests,
}: RassModalProps) => {
	const dispatch = useAppDispatch();

	const handleModalOk = () => {};

	return (
		// <Modal show={showModal} centered className={localStyles.modal}>
		// 	<Modal.Body className={fileStyles.texts}>
		// 		<h4>Centered Modal</h4>
		// 		<p>
		// 			Cras mattis consectetur purus sit amet fermentum. Cras justo
		// 			odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
		// 			risus, porta ac consectetur ac, vestibulum at eros.
		// 		</p>
		// 	</Modal.Body>
		// 	<Modal.Footer>
		// 		<Button className="btn-light"
		// 			onClick={() =>
		// 				dispatch(modalsShowActions.setShowRassModal(false))
		// 			}>
		// 			Odustani
		// 		</Button>
		//         <Button className="btn-primary">
		//             Spremi
		//         </Button>
		// 	</Modal.Footer>
		// </Modal>
		<ConfigProvider
			modal={
				{
					// className: localStyles.modal,
				}
			}>
			<Modal
				centered
                className="modalBg"
				open={showModal}
				onOk={handleModalOk}
				okText='Spremi'
				cancelText='Odustani'
				closable={false}
				maskClosable={false}
				styles={{ body: { backgroundColor: "blue" } }}
				okButtonProps={{ type: "primary" }}
				wrapClassName={localStyles.modal}
				onCancel={() =>
					dispatch(modalsShowActions.setShowRassModal(false))
				}>
				<h2>TODO RASS !</h2>
				<h3>
					TODO when working with patientRassTests object check for its
					existance!
				</h3>
			</Modal>
		</ConfigProvider>
	);
};

export default RassModal;

/*


function App() {
          const [modalShow, setModalShow] = React.useState(false);
        
          return (
            <>
              <Button variant="primary" onClick={() => setModalShow(true)}>
                Launch vertically centered modal
              </Button>
        
              <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
              />
            </>
          );
        }

*/

/*


		<ConfigProvider
            modal={{
                className: localStyles.modal,
            }}
        >
			<Modal
				centered
				open={showModal}
				onOk={handleModalOk}
				okText='Spremi'
				cancelText='Odustani'
				closable={false}
				maskClosable={false}
				okButtonProps={{ type: "primary" }}
				onCancel={() =>
					dispatch(modalsShowActions.setShowRassModal(false))
				}>
				<h2>TODO RASS !</h2>
				<h3>
					TODO when working with patientRassTests object check for its
					existance!
				</h3>
			</Modal>
		</ConfigProvider>

*/
