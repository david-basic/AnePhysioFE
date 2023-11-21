import { Layout } from "antd";
import { FC, type PropsWithChildren } from "react";
import HeaderBar from "./HeaderBar";
import { Content } from "antd/es/layout/layout";
import { Sidebar } from "./Sidebar";

type MainLayoutProps = PropsWithChildren;

const MainLayout: FC<MainLayoutProps> = ({ children }: MainLayoutProps) => {
	return (
		<Layout>
			<HeaderBar />
			<Content style={{ margin: 0 }}>
				<Layout>
					<Sidebar />
					<Layout>
						<Content className='content_padding'>
							{children}
						</Content>
					</Layout>
				</Layout>
			</Content>
		</Layout>
	);
};

export default MainLayout;
