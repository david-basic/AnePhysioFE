import { useEffect, type FC } from "react";
import api_routes from "../config/api_routes";
import useFetchApi from "../hooks/use_fetch_api";
import { useAppDispatch } from "../hooks/use_app_dispatch";
import { HttpStatusCode } from "axios";
import { ApiGetAllDepartmentsResponse } from "../type";
import { deptLocalitiesActions } from "../store/dept-localities-slice";
import constants from "../config/constants";
import localforage from "localforage";

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
						(
							departmentResponseData: ApiGetAllDepartmentsResponse
						) => {
							if (
								departmentResponseData.status !==
								HttpStatusCode.Ok
							) {
								console.error(
									"There was a error fetching departments"
								);
							} else {
								departmentResponseData.data!.map((dept) => {
									dept.shorthand === constants.JIL_RIJEKA && dispatch(deptLocalitiesActions.setJilRijeka(dept));
									dept.shorthand === constants.JIL_SUSAK && dispatch(deptLocalitiesActions.setJilSusak(dept));
									dept.shorthand === constants.CRC && dispatch(deptLocalitiesActions.setCrc(dept));
									dept.shorthand === constants.KARDIO_JIL && dispatch(deptLocalitiesActions.setKardioJil(dept));

									dept.shorthand === constants.KARDIO_JIL && localforage.setItem(dept.shorthand, dept);

									return "done";
								});
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
