import { Layout } from "antd";
import React, { ReactElement } from "react";
import HeaderBar from "./HeaderBar";
import { Content } from "antd/es/layout/layout";
import { Sidebar } from "./Sidebar";

interface Props {
	children: ReactElement;
}

const MainLayout: React.FC<Props> = (props: Props) => {
	const { children } = props;

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
