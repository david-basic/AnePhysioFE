import { useCallback, useEffect, useRef } from "react";
import useFetchApi from "./use_fetch_api";
import useRefreshCurrentToken from "./use_refresh_current_token";
import { type RequestConfig } from "../type";
import { useAppSelector } from "./use_app_selector";
import isNullOrEmpty from "../util/isNullOrEmpty";

const useFetcApihWithTokenRefresh = () => {
	const { sendRefreshTokenRequest } = useRefreshCurrentToken();
	const { sendRequest: fetchApi, isLoading } = useFetchApi();

	const accessTokenRef = useRef<string | null>(null);
	const accessToken = useAppSelector(
		(state) => state.authReducer.accessToken
	);

	useEffect(() => {
		accessTokenRef.current = accessToken;
	}, [accessToken]);

	const fetchWithTokenRefresh = useCallback(
		async (
			requestConfig: RequestConfig,
			manageResponseData: (arg: any) => void
		) => {
			try {
				await sendRefreshTokenRequest();

				const updatedAccessToken = accessTokenRef.current;

                // console.log("updatedAccessToken...", updatedAccessToken); //XXX remove
				
                if (!isNullOrEmpty(updatedAccessToken)) {
					const response = await fetchApi(
						requestConfig,
						manageResponseData,
						updatedAccessToken!
					);

					return response;
				} else {
					throw new Error(
						"Access token not available after refresh!"
					);
				}
			} catch (error) {
				console.error(
					"Error occurred while fetching with token refresh:",
					error
				);
				throw error;
			}
		},
		[sendRefreshTokenRequest, fetchApi]
	);

	return { fetchWithTokenRefresh, isLoading };
};

export default useFetcApihWithTokenRefresh;
