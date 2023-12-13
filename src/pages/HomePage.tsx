import { useEffect, type FC } from "react";
import api_routes from "../config/api_routes";
import { useAppSelector } from "../hooks/use_app_selector";

const HomePage: FC = () => {
	const tokenType = useAppSelector((state) => state.auth.tokenType);
	const accessToken = useAppSelector((state) => state.auth.accessToken);
	const fullToken = `${tokenType} ${accessToken}`;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					`${api_routes.ROUTE_DEPT_GET_ALL}`,
					{
						method: "GET",
						headers: {
							Authorization: `${fullToken}`,
						},
					}
				);

				const result = await response.json();
				console.log(result);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

			fetchData();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			{/* title */}
			{/* department choice Cards 2 per row max */}
		</>
	);
};

export default HomePage;
