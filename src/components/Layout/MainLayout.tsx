import { Layout } from "antd";
import { useEffect, type FC, type PropsWithChildren } from "react";
import { Content } from "antd/es/layout/layout";
import { Sidebar } from "./Sidebar";
import styles from "./MainLayout.module.css";
import api_routes from "../../config/api_routes";
import { useAppSelector } from "../../hooks/use_app_selector";
import useHttp from "../../hooks/use_http";

type MainLayoutProps = PropsWithChildren;

const MainLayout: FC<MainLayoutProps> = ({ children }: MainLayoutProps) => {
	const tokenType = useAppSelector((state) => state.auth.tokenType);
	const accessToken = useAppSelector((state) => state.auth.accessToken);
	const fullToken = `${tokenType} ${accessToken}`;
	const { sendRequest: fetchDepartmentsRequest } = useHttp();

	useEffect(() => {
		if (sessionStorage.getItem("canFetchInitialData") === "true") {
			console.log("entered");
			
			fetchDepartmentsRequest(
				{
					url: api_routes.ROUTE_DEPT_GET_ALL,
					method: "GET",
					headers: {
						Authorization: fullToken,
					},
					body: null,
				},
				manageFetchedDepartmentsData.bind(null)
			);

			sessionStorage.setItem("canFetchInitialData", "false");
		}
	});

	function manageFetchedDepartmentsData(departmentResponseData: any) {
		console.log(departmentResponseData);
	}

	return (
		<Layout>
			<Content style={{ margin: 0 }}>
				<Layout>
					<Sidebar />
					<Layout className={`${styles["parent-container"]}`}>
						<Content
							className={`content_padding ${styles["centered-component"]}`}>
							{children}
						</Content>
					</Layout>
				</Layout>
			</Content>
		</Layout>
	);
};

export default MainLayout;
