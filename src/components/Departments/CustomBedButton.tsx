import {
	type ReactNode,
	type FC,
	type MouseEvent,
	type ButtonHTMLAttributes,
} from "react";
import localStyles from "./CustomBedButton.module.css";
import { Row, message } from "antd";
import useFetcApihWithTokenRefresh from "../../hooks/use_fetch_api_with_token_refresh";
import api_routes from "../../config/api_routes";
import { type ApiResponse } from "../../type";
import { type PhysioFileVM } from "../../models/physiofile/PhysioFileVM";
import { HttpStatusCode } from "axios";
import { physioFileActions } from "../../store/physio-file-slice";
import { useAppDispatch } from "../../hooks/use_app_dispatch";
import { modalsShowActions } from "../../store/modals-show-slice";

type CustomBedButtonProps = {
	label: string;
	to: string;
	patientId?: string;
	bedIsEmpty: boolean;
	icon?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const CustomBedLink: FC<CustomBedButtonProps> = ({
	label,
	icon,
	bedIsEmpty,
	patientId,
	to,
	...buttonProps
}: CustomBedButtonProps) => {
	const { className: passedClassName, ...otherButtonProps } = buttonProps;
	const dispatch = useAppDispatch();
	const { fetchWithTokenRefresh, isLoading } = useFetcApihWithTokenRefresh();

	const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
		if (bedIsEmpty || isLoading) {
			e.preventDefault();
			return;
		}

		try {
			fetchWithTokenRefresh(
				{
					url:
						api_routes.ROUTE_PHYSIO_FILE_GET_ALL_BY_PATIENT_ID +
						`/${patientId}`,
					headers: { "Content-Type": "application/json" },
				},
				(physioFileResponse: ApiResponse<PhysioFileVM[]>) => {
					if (physioFileResponse.status !== HttpStatusCode.Ok) {
						message.error(
							"Nije moguće dohvatiti fizioterapeutske kartone pacijenta!"
						);
						message.error(physioFileResponse.message);
						console.error(
							"There was a error while fetching physio files: ",
							physioFileResponse
						);
					} else {
						dispatch(
							physioFileActions.setCurrentPatientPhysioFileList(
								physioFileResponse.data!
							)
						);
						message.success(
							"Dohvaćeni fizioterapeutski kartoni pacijenta!"
						);
						dispatch(
							modalsShowActions.setShowChoosePhysioFileModal(true)
						);
						dispatch(
							physioFileActions.setCurrentPatientId(patientId!)
						);
					}
				}
			);
		} catch (error) {
			console.error("Error fetching physio files:", error);
			message.error(
				"Neuspjelo dohvaćanje fizioterapeutskih kartona pacijenta!"
			);
		}
	};

	return (
		<>
			<Row
				align={"middle"}
				className={bedIsEmpty ? localStyles.rowEmpty : localStyles.row}>
				<button
					className={
						passedClassName
							? `${passedClassName} ${localStyles.customButton}`
							: localStyles.customButton
					}
					style={
						bedIsEmpty
							? { cursor: "not-allowed" }
							: { cursor: "pointer" }
					}
					disabled={bedIsEmpty || isLoading}
					onClick={bedIsEmpty || isLoading ? undefined : handleClick}
					{...otherButtonProps}>
					{icon && (
						<span
							className={
								bedIsEmpty
									? localStyles.bedEmptyIcon
									: localStyles.icon
							}>
							{icon}
						</span>
					)}
					<span
						className={
							bedIsEmpty
								? localStyles.bedEmptyLabel
								: localStyles.label
						}>
						{label}
					</span>
				</button>
			</Row>
		</>
	);
};

export default CustomBedLink;
