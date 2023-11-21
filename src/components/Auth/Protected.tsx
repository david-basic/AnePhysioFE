import { FC, type PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import client_routes from "../../config/client_routes";

type ProtectedProps = PropsWithChildren<{
	isLoggedIn: boolean;
}>

const Protected: FC<ProtectedProps> = (props: ProtectedProps) => {
	if (!props.isLoggedIn) {
		return <Navigate to={client_routes.ROUTE_AUTH} replace={true} />;
	}
	return <>{props.children}</>;
};
export default Protected;
