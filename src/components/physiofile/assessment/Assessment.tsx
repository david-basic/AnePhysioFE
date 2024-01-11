import { ChangeEvent, useState, type FC } from "react";
import { type AssessmentVM } from "../../../models/physiofile/assessment/AssessmentVM";
import localStyles from "./Assessment.module.css";
import TextArea from "antd/es/input/TextArea";
import { useDispatch } from "react-redux";
import { physioFileActions } from "../../../store/physio-file-slice";

type AssessmentProps = {
	patientAssessment: AssessmentVM;
};

const Assessment: FC<AssessmentProps> = ({
	patientAssessment,
}: AssessmentProps) => {
	const dispatch = useDispatch();
	const [assesmentNotes, setAssesmentNotes] = useState(
		patientAssessment.notes
	);

	const handleAssessmentNotesChange = (
		event: ChangeEvent<HTMLTextAreaElement>
	) => {
		setAssesmentNotes(event.target.value);
		dispatch(physioFileActions.setDataSaved(false));
	};

	return (
		<TextArea
			id='assessmentNotes'
			value={assesmentNotes}
			autoSize={{ minRows: 4 }}
			onChange={handleAssessmentNotesChange}
			placeholder='...'
			style={{ maxWidth: "930px" }}
			className={localStyles.textArea}
		/>
	);
};

export default Assessment;
