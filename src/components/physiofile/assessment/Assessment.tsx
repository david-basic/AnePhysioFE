import { type FocusEvent, type FC, useState, ChangeEvent } from "react";
import { type AssessmentVM } from "../../../models/physiofile/assessment/AssessmentVM";
import localStyles from "./Assessment.module.css";
import TextArea from "antd/es/input/TextArea";
import { physioFileActions } from "../../../store/physio-file-slice";
import { useAppDispatch } from "../../../hooks/use_app_dispatch";
import { PhysioFileVM } from "../../../models/physiofile/PhysioFileVM";

type AssessmentProps = {
	patientAssessment: AssessmentVM;
	physioFile: PhysioFileVM;
};

const Assessment: FC<AssessmentProps> = ({
	patientAssessment,
	physioFile,
}: AssessmentProps) => {
	const dispatch = useAppDispatch();
	const [assesmentNotes, setAssesmentNotes] = useState(
		patientAssessment.notes
	);

	const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setAssesmentNotes(event.target.value);
	};

	const handleFocusLost = (event: FocusEvent<HTMLTextAreaElement>) => {
		dispatch(physioFileActions.setAssessmentNotes(event.target.value));
		dispatch(physioFileActions.setPhysioFileDataSaved(false));
	};

	return (
		<TextArea
			id='assessmentNotes'
			value={assesmentNotes}
			autoSize={{ minRows: 4 }}
			disabled={physioFile.fileClosedBy !== null}
			onChange={handleChange}
			onBlur={handleFocusLost}
			placeholder='...'
			style={{ maxWidth: "930px" }}
			className={localStyles.textArea}
		/>
	);
};

export default Assessment;
