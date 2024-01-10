import { type FC } from "react";
import LoadingSpinner from "../LoadingSpinner";
import { type PhysioFileVM } from "../../models/physiofile/PhysioFileVM";

type PhysioFileProps = {
	physioFile: PhysioFileVM;
	isLoading: boolean;
};

const PhysioFile: FC<PhysioFileProps> = ({
	isLoading,
	physioFile,
}: PhysioFileProps) => {
	return (
		<>
			{isLoading && <LoadingSpinner />}
			{!isLoading && (
				<>
					<p>TESTSTESTSETT</p>
					<p>TESTSTESTSETT</p>
					<p>TESTSTESTSETT</p>
					<p>TESTSTESTSETT</p>
					<p>TESTSTESTSETT</p>


				</>
			)}
		</>
	);
};

export default PhysioFile;
