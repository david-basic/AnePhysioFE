import { Layout } from "antd";
import { type FC, type PropsWithChildren } from "react";
import HeaderBar from "./HeaderBar";
import { Content } from "antd/es/layout/layout";
import { Sidebar } from "./Sidebar";
import styles from "./MainLayout.module.css";

type MainLayoutProps = PropsWithChildren;

const MainLayout: FC<MainLayoutProps> = ({ children }: MainLayoutProps) => {
	return (
		<Layout>
			<HeaderBar />
			<Content style={{ margin: 0 }}>
				<Layout>
					<Sidebar />
					<Layout className={`${styles["parent-container"]}`}>
						<Content className={`content_padding ${styles["centered-component"]}`}>
							{children}
						</Content>
					</Layout>
				</Layout>
			</Content>
		</Layout>
	);
};

export default MainLayout;
