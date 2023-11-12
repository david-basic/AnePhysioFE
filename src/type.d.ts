type LoginInputData = {
	username: string;
	password: string;
};

type RequestConfig = {
	url: RequestInfo | URL;
	method?: string | undefined;
	body?: any;
	headers?: HeadersInit | undefined;
};

type AuthInitState = {
	isLoggedIn: boolean;
	username: string;
};
