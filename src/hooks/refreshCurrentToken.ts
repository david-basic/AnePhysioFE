import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "./use_app_dispatch";
import { useAppSelector } from "./use_app_selector";
import { useCallback } from "react";
import api_routes from "../config/api_routes";
import { type ApiResponse, type LoginResponseData } from "../type";
import { HttpStatusCode } from "axios";
import localforage from "localforage";
import { authActions } from "../store/auth-slice";
import { deptLocalitiesActions } from "../store/dept-localities-slice";
import client_routes from "../config/client_routes";
import { message } from "antd";
import isNullOrEmpty from "../util/isNullOrEmpty";

const useRefreshCurrentToken = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const refreshToken = useAppSelector(
		(state) => state.authReducer.refreshToken
	);

	const sendRefreshTokenRequest = useCallback(async () => {
		if (!isNullOrEmpty(refreshToken) && sessionStorage.getItem("tokenRefreshFlag") === "true") {
			try {
					const response = await fetch(
						api_routes.ROUTE_AUTH_REFRESH_TOKEN,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								refreshToken: refreshToken,
							}),
						}
					);

					const responseData: ApiResponse<LoginResponseData> =
						await response.json();

					// console.log("NEEDS TO BE FIRST!"); //XXX remove

					if (responseData.status !== HttpStatusCode.Ok) {
						localforage.clear();
						sessionStorage.clear();
						localStorage.clear();

						dispatch(authActions.resetAllStateToDefaults());
						dispatch(
							deptLocalitiesActions.resetDepartmentLocaltiesToInitValues()
						);

						dispatch(authActions.setTokenIsValid(false));

						navigate(client_routes.ROUTE_AUTH, { replace: true });
						message.warning(
							"Your session expired! Please sign in again."
						);
					} else {
						dispatch(
							authActions.setTokenType(
								responseData.data!.tokenType
							)
						);
						dispatch(
							authActions.setAccessToken(
								responseData.data!.accessToken
							)
						);
						dispatch(
							authActions.setRefreshToken(
								responseData.data!.refreshToken
							)
						);

						dispatch(authActions.setTokenIsValid(true));

					}
			} catch (error: any) {
				console.error("Error occured during fetching... ", error);
			}
		}
	}, [dispatch, navigate, refreshToken]);

	return { sendRefreshTokenRequest };
};

export default useRefreshCurrentToken;
