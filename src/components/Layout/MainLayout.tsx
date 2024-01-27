import { Layout } from "antd";
import { type FC, type PropsWithChildren } from "react";
import { Content } from "antd/es/layout/layout";
import { MainLayoutSidebar } from "./MainLayoutSidebar";
import styles from "./MainLayout.module.css";

type MainLayoutProps = PropsWithChildren;

const MainLayout: FC<MainLayoutProps> = ({ children }: MainLayoutProps) => {
	return (
		<Layout>
			<Content style={{ margin: 0 }}>
				<Layout>
					<MainLayoutSidebar />
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
