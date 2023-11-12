import { FC } from "react";
import { Navigate } from "react-router-dom";
import client_routes from "../../config/client_routes";

type Props = {
	isLoggedIn: boolean;
	children?: React.ReactNode;
};

const Protected: FC<Props> = (props) => {
	if (!props.isLoggedIn) {
		return <Navigate to={client_routes.ROUTE_AUTH} replace={true} />;
	}
	return <>{props.children}</>;
};
export default Protected;
