import { useCallback, useState } from "react";
import { useAppSelector } from "./use_app_selector";
import { RequestConfig } from "../type";
import useRefreshCurrentToken from "./refreshCurrentToken";

type UseFetchApiReturnType = {
	isLoading: boolean;
	sendRequest: (
		requestConfig: RequestConfig,
		manageResponseData: (arg: any) => void
	) => Promise<{
		cleanupFunction: () => void;
	}>;
};

const useFetchApi = (): UseFetchApiReturnType => {
	const [isLoading, setIsLoading] = useState(false);
	const tokenType = useAppSelector((state) => state.authReducer.tokenType);
	const accessToken = useAppSelector(
		(state) => state.authReducer.accessToken
	);
	const { sendRefreshTokenRequest } = useRefreshCurrentToken();
	const fullToken = `${tokenType} ${accessToken}`;

	// sendRefreshTokenRequest(); //TODO maybe put this call inside useCallback ?

	const sendRequest = useCallback(
		async (
			requestConfig: RequestConfig,
			manageResponseData: (arg: any) => void
		) => {
			setIsLoading(true);

			let abortController = new AbortController();
			const { signal } = abortController;

			try {
				const response = await fetch(requestConfig.url, {
					method: requestConfig.method ? requestConfig.method : "GET",
					headers: requestConfig.headers
						? { Authorization: fullToken, ...requestConfig.headers }
						: {
								Authorization: fullToken,
						  },
					body: requestConfig.body
						? JSON.stringify(requestConfig.body)
						: null,
					signal,
				});

				const responseData = await response.json();

				manageResponseData(responseData);

				setIsLoading(false);
			} catch (error) {
				console.error("Error fetching data:", error);
				setIsLoading(false);
			}

			return {
				cleanupFunction: () => {
					abortController.abort("Cleanup function called.");
				},
			};
		},
		[fullToken]
	);

	return { isLoading, sendRequest };
};

export default useFetchApi;
