import { type FC } from "react";
import Department from "../../components/Departments/Department";

const JilSusakHomePage: FC = () => {
	return (
		<Department
			id='1'
			name='1'
			locality={{ id: "1.1", displayName: "1.1", name: "1.1" }}
			shorthand='JIL susak'
			key={"susak"}
			boxes={[
				{ id: "1", name: "1", beds: [] },
				{ id: "2", name: "2", beds: [] },
			]}
		/>
	);
};

export default JilSusakHomePage;
