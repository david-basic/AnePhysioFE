import { useEffect, type FC } from "react";
import api_routes from "../config/api_routes";
import useFetchApi from "../hooks/use_fetch_api";
import { useAppDispatch } from "../hooks/use_app_dispatch";
import { HttpStatusCode } from "axios";
import { deptActions } from "../store/dept-slice";
import { ApiGetAllDepartmentsResponse } from "../type";

const HomePage: FC = () => {
	const { sendRequest: fetchDepartmentsRequest } = useFetchApi();
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (sessionStorage.getItem("canFetchInitialData") === "true") {
			sessionStorage.setItem("canFetchInitialData", "false");
			const fetchData = async () => {
				try {
					const { cleanupFunction } = await fetchDepartmentsRequest(
						{
							url: api_routes.ROUTE_DEPT_GET_ALL,
						},
						(departmentResponseData: ApiGetAllDepartmentsResponse) => {

							console.log(departmentResponseData);

							if (departmentResponseData.status !== HttpStatusCode.Ok) {
								console.error("There was a error fetching departments");
								console.log(departmentResponseData); //TODO remove before production
							} else {
								if(departmentResponseData.data!.length !== 0) { //TODO check this out, might change it and handle the case when there are no departments (however unlikely)
									departmentResponseData.data!.map(dept => dispatch(deptActions.addToDepartmentList(dept)));
								}
							}
						}
					);
					return () => {
						cleanupFunction();
					};
				} catch (error: any) {
					console.error("Error fetching departments:", error);
				}
			};

			fetchData();
		}
	}, [dispatch, fetchDepartmentsRequest]);

	return <>{/* title */}</>;
};

export default HomePage;
