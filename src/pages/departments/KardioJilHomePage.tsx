import { type FC } from "react";
import Department from "../../components/Departments/Department";

const KardioJilHomePage: FC = () => {
	return (
		<Department
			id='1'
			name='1'
			locality={{ id: "1.1", displayName: "1.1", name: "1.1" }}
			shorthand='JIL kardio'
			key={"kardio"}
			boxes={[
				{ id: "1", name: "1", beds: [] },
				{ id: "2", name: "2", beds: [] },
				{ id: "3", name: "3", beds: [] },
			]}
		/>
	);
};

export default KardioJilHomePage;
