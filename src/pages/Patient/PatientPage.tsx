import { useEffect, type FC, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { getIdFromUrl } from "../../util/UrlHelper";
import useFetchApi from "../../hooks/use_fetch_api";
import api_routes from "../../config/api_routes";
import PhysioCard from "../../components/Patient/PhysioCard";

const PatientPage: FC = () => {
	const patientId = getIdFromUrl(useLocation());
	const { isLoading, sendRequest: fetchPatientDetailsRequest } =
		useFetchApi();
	sessionStorage.setItem("loadedOnce", "false");

	const fetchData = useCallback(async () => {
		try {
			fetchPatientDetailsRequest(
				{
					url: api_routes.ROUTE_PATIENT_GET + `/${patientId}`,
					headers: { "Content-Type": "application/json" },
				},
				(patientDetailsResponseData: any) => {
					//TODO change from any to ApiResponse<VM_THAT_YOU_WILL_CREATE_FOR_PHYSIO_KARTON>
					console.log(
						"patient details... ",
						patientDetailsResponseData

						//TODO store patient data to a state that will be active only while the user is on the carton, before exit you will ask
						// the user if they wish to exit before saving stored data, you will also keep a state called dataSaved which will be a boolean that will indicate saved state
						// the dataSaved state will change once POST is sent to the server to true and then user wont be asked before exit
						// instead of loadedOnce in session storage you will check for another state also called loadedOnce that will be persisted and only reset to false once
						// user saves their work so that reloading of data does not remove the changes, you will also use refs for the form like you did on login form.
					);
				}
			);
		} catch (error) {
			console.error("Error:", error);
		}
	}, [fetchPatientDetailsRequest, patientId]);

	useEffect(() => {
		if (sessionStorage.getItem("loadedOnce") !== "true") {
			fetchData();
		}

		return () => {
			sessionStorage.setItem("loadedOnce", "true");
		};
	}, [fetchData]);

	return <PhysioCard patientId={patientId} isLoading={isLoading} />;
};

export default PatientPage;
