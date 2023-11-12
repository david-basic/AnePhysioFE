import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const useHttp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

    const sendRequest = useCallback(
        async (
            requestConfig: RequestConfig,
            manageResponseData: (arg: any) => void
        ) => {
            setIsLoading(true);

            if (!isLoggedIn) {
                const response = await fetch(
                    requestConfig.url,
                    {
                        method: requestConfig.method ? requestConfig.method : "GET",
                        headers: requestConfig.headers ? requestConfig.headers : undefined,
                        body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
                    }
                );

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
