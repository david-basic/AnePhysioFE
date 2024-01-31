import { useEffect, type FC } from "react";
import api_routes from "../config/api_routes";
import { useAppDispatch } from "../hooks/use_app_dispatch";
import { HttpStatusCode } from "axios";
import { type ApiResponse } from "../type";
import { deptLocalitiesActions } from "../store/dept-localities-slice";
import constants from "../config/constants";
import { type DepartmentVM } from "../models/department/DepartmentVM";
import useFetchApi from "../hooks/use_fetch_api";
import { useAppSelector } from "../hooks/use_app_selector";

const HomePage: FC = () => {
	const { sendRequest: fetchDepartmentsRequest } = useFetchApi(); //TODO promijeni u fetch with refresh token call 
	const dispatch = useAppDispatch();
	const accessToken = useAppSelector((state) => state.authReducer.accessToken);

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
							departmentResponseData: ApiResponse<DepartmentVM[]>
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

									return "done";
								});
							}
						},
						accessToken
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
	}, [accessToken, dispatch, fetchDepartmentsRequest]);

	return <>{/* title */}</>;
};

export default HomePage;
