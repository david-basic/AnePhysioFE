import { useCallback, useState } from "react";
import { useAppSelector } from "./use_app_selector";
import { RequestConfig } from "../type";

const useHttp = () => {
	const [isLoading, setIsLoading] = useState(false);
	const isLoggedIn = useAppSelector((state) => state.authReducer.isLoggedIn);
	const tokenType = useAppSelector((state) => state.authReducer.tokenType);
	const accessToken = useAppSelector((state) => state.authReducer.accessToken);
	const fullToken = `${tokenType} ${accessToken}`;

	const sendRequest = useCallback(
		async (
			requestConfig: RequestConfig,
			manageResponseData: (arg: any) => void
		) => {
			setIsLoading(true);

			if (!isLoggedIn) {
				const response = await fetch(requestConfig.url, {
					method: requestConfig.method ? requestConfig.method : "GET",
					headers: requestConfig.headers
						? requestConfig.headers
						: {
								Authorization: fullToken,
						  },
					body: requestConfig.body
						? JSON.stringify(requestConfig.body)
						: null,
				});

				const responseData = await response.json();

				manageResponseData(responseData);

				setIsLoading(false);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	return {
		isLoading,
		sendRequest,
	};
};

export default useHttp;
