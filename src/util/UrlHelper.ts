import { Location } from "react-router-dom";

export const getIdFromUrl = (url: Location): string => {
	const currentUrl = url.pathname.split("/");
	const id = currentUrl[currentUrl.length - 1];
	return id;
};
	