import TextArea from "antd/es/input/TextArea";
import { type FocusEvent, type FC, useState, ChangeEvent } from "react";
import assessmentStyles from "../assessment/Assessment.module.css";
import { useAppDispatch } from "../../../hooks/use_app_dispatch";
import { physioFileActions } from "../../../store/physio-file-slice";

type PhysioNotesProps = {
	notes: string;
};

const PhysioNotes: FC<PhysioNotesProps> = ({ notes }: PhysioNotesProps) => {
	const dispatch = useAppDispatch();
	const [patientNotes, setPatientNotes] = useState(notes);

	const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setPatientNotes(event.target.value);
	};

	const handleFocusLost = (event: FocusEvent<HTMLTextAreaElement>) => {
		dispatch(physioFileActions.setNotes(event.target.value));
		dispatch(physioFileActions.setPhysioFileDataSaved(false));
	};

	return (
		<TextArea
			id='physioFileNotes'
			value={patientNotes}
			autoSize={{ minRows: 4 }}
			onChange={handleChange}
			onBlur={handleFocusLost}
			placeholder='...'
			style={{ maxWidth: "930px" }}
			className={assessmentStyles.textArea}
		/>
	);
};

export default PhysioNotes;
