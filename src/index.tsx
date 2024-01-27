import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store";
import { BrowserRouter } from "react-router-dom";
import { StrictMode } from "react";
import { PersistGate } from "redux-persist/integration/react";
import LoadingSpinner from "./components/LoadingSpinner";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

root.render(
	<Provider store={store}>
		<PersistGate persistor={persistor} loading={<LoadingSpinner />}>
			<BrowserRouter>
				<StrictMode>
					<App />
				</StrictMode>
			</BrowserRouter>
		</PersistGate>
	</Provider>
);
