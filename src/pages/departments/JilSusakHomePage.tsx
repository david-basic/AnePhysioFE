import { type FC } from "react";
import Department from "../../components/departments/Department";
import { useAppSelector } from "../../hooks/use_app_selector";

const JilSusakHomePage: FC = () => {
	const departmentData = useAppSelector(
		(state) => state.deptLocalitiesReducer.jilSusak
	);

	return (
		<Department
			id={departmentData.id}
			name={departmentData.name}
			locality={departmentData.locality}
			shorthand={departmentData.shorthand}
			key={departmentData.shorthand}
			boxes={departmentData.boxes}
		/>
	);
};

export default JilSusakHomePage;
