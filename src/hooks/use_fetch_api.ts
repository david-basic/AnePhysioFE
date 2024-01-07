import { useCallback, useState } from "react";
import { useAppSelector } from "./use_app_selector";
import { type RequestConfig } from "../type";

type UseFetchApiReturnType = {
	isLoading: boolean;
	sendRequest: (
		requestConfig: RequestConfig,
		manageResponseData: (arg: any) => void,
		accessToken: string
	) => Promise<{
		cleanupFunction: () => void;
	}>;
};

const useFetchApi = (): UseFetchApiReturnType => {
	const [isLoading, setIsLoading] = useState(false);
	const tokenIsValid = useAppSelector(
		(state) => state.authReducer.tokenIsValid
	);
	const isLoggedIn = useAppSelector((state) => state.authReducer.isLoggedIn);
	const tokenType = useAppSelector((state) => state.authReducer.tokenType);

	const sendRequest = useCallback(
		async (
			requestConfig: RequestConfig,
			manageResponseData: (arg: any) => void,
			accessToken: string,
		) => {
			setIsLoading(true);

			let abortController = new AbortController();
			const { signal } = abortController;

			try {
				if (tokenIsValid || !isLoggedIn) {

					// const rqCon = {Authorization: `${tokenType} ${accessToken}`, ...requestConfig.headers}; //XXX remove
					// console.log("requestConfig...", requestConfig); //XXX remove
					// console.log("rq Headers...", rqCon);//XXX remove

					const response = await fetch(requestConfig.url, {
						method: requestConfig.method
							? requestConfig.method
							: "GET",
						headers: requestConfig.headers
							? {
									Authorization: `${tokenType} ${accessToken}`,
									...requestConfig.headers,
							  }
							: {
									Authorization: `${tokenType} ${accessToken}`,
							  },
						body: requestConfig.body
							? JSON.stringify(requestConfig.body)
							: null,
						signal,
					});

					// console.log("response...", response); //XXX remove
					const responseData = await response.json();
					// console.log("responseData...", responseData); //XXX remove

					// console.log("NEEDS TO BE SECOND!!"); //XXX remove

					manageResponseData(responseData);
				}

				setIsLoading(false);

				return {
					cleanupFunction: () => {
						abortController.abort("Cleanup function executed.");
					},
				};
			} catch (error) {
				console.error("Error fetching data:", error);
				setIsLoading(false);
				throw error;
			}
		},
		[isLoggedIn, tokenIsValid, tokenType]
	);

	return { isLoading, sendRequest };
};

export default useFetchApi;
