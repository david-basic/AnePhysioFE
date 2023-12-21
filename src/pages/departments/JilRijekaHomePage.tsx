import { type FC } from "react";
import Department from "../../components/Departments/Department";
import { useAppSelector } from "../../hooks/use_app_selector";

const JilRijekaHomePage: FC = () => {
	const departmentData = useAppSelector(
		(state) => state.deptLocalities.jilRIjeka
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

export default JilRijekaHomePage;
