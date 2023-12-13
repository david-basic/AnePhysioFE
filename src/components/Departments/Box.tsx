import { Card } from "antd";
import { type FC } from "react";
import { BoxVM } from "../../models/BoxVM";

const Box: FC<BoxVM> = (props: BoxVM) => {
	return (
		<Card style={{ width: 300, marginTop: 16 }} loading={true}>
			<ul style={{ listStyle: "none" }}>
				
			</ul>
		</Card>
	);
};

export default Box;
