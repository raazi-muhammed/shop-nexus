import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/user/LoginPage";
import SignUpPage from "./pages/user/SignUpPage";
import ActivationPage from "./pages/user/ActivationPage";
import "./styles/App.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import HomePage from "./pages/User/HomePage";

function App() {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route path="/sign-up" element={<SignUpPage />} />
			<Route path="/api/v1/activation" element={<ActivationPage />} />
			<Route path="*" element={<HomePage />} />
		</Routes>
	);
}

export default App;
