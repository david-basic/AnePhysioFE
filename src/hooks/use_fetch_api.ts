import { useCallback, useState } from "react";
import { useAppSelector } from "./use_app_selector";
import { type RequestConfig } from "../type";
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
	const { sendRefreshTokenRequest } = useRefreshCurrentToken();

	// console.log("tokenRefreshFlag before check...", sessionStorage.getItem("tokenRefreshFlag"));

	if (sessionStorage.getItem("tokenRefreshFlag") === "true") {
		sendRefreshTokenRequest();
		sessionStorage.setItem("tokenRefreshFlag", "false");
	}

	// console.log("tokenRefreshFlag after check...", sessionStorage.getItem("tokenRefreshFlag"));

	const [isLoading, setIsLoading] = useState(false);
	const tokenIsValid = useAppSelector(
		(state) => state.authReducer.tokenIsValid
	);
	const isLoggedIn = useAppSelector((state) => state.authReducer.isLoggedIn);
	const tokenType = useAppSelector((state) => state.authReducer.tokenType);
	const accessToken = useAppSelector(
		(state) => state.authReducer.accessToken
	);
	const fullToken = `${tokenType} ${accessToken}`;

	const sendRequest = useCallback(
		async (
			requestConfig: RequestConfig,
			manageResponseData: (arg: any) => void
		) => {
			setIsLoading(true);

			let abortController = new AbortController();
			const { signal } = abortController;

			try {
				if (tokenIsValid || !isLoggedIn) {
					const response = await fetch(requestConfig.url, {
						method: requestConfig.method
							? requestConfig.method
							: "GET",
						headers: requestConfig.headers
							? {
									Authorization: fullToken,
									...requestConfig.headers,
							  }
							: {
									Authorization: fullToken,
							  },
						body: requestConfig.body
							? JSON.stringify(requestConfig.body)
							: null,
						signal,
					});

					const responseData = await response.json();

					sessionStorage.setItem("tokenRefreshFlag", "true");

					// console.log("NEEDS TO BE SECOND!!"); //XXX remove

					manageResponseData(responseData);
				}

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
		[fullToken, isLoggedIn, tokenIsValid]
	);

	return { isLoading, sendRequest };
};

export default useFetchApi;
