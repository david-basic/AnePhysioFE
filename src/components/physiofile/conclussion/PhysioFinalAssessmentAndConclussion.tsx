import { ChangeEvent, FC, FocusEvent, useState } from "react";
import { useAppDispatch } from "../../../hooks/use_app_dispatch";
import { physioFileActions } from "../../../store/physio-file-slice";
import TextArea from "antd/es/input/TextArea";
import assessmentStyles from "../assessment/Assessment.module.css";
import { PhysioFileVM } from "../../../models/physiofile/PhysioFileVM";

type ConclussionProps = {
	physioFile: PhysioFileVM;
	conclussion: string;
};

const PhysioFinalAssessmentAndConclussion: FC<ConclussionProps> = ({
	physioFile,
	conclussion,
}: ConclussionProps) => {
	const dispatch = useAppDispatch();
	const [finalConclussion, setFinalConclussion] = useState(conclussion);

	const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setFinalConclussion(event.target.value);
	};

	const handleFocusLost = (event: FocusEvent<HTMLTextAreaElement>) => {
		dispatch(physioFileActions.setConclussion(event.target.value));
		dispatch(physioFileActions.setPhysioFileDataSaved(false));
	};

	return (
		<TextArea
			id='physioFileConclussion'
			disabled={physioFile.fileClosedBy !== null}
			value={finalConclussion}
			autoSize={{ minRows: 4 }}
			onChange={handleChange}
			onBlur={handleFocusLost}
			placeholder='...'
			style={{ maxWidth: "930px" }}
			className={assessmentStyles.textArea}
		/>
	);
};

export default PhysioFinalAssessmentAndConclussion;
