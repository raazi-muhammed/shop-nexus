import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/user/LoginPage";
import SignUpPage from "./pages/user/SignUpPage";
import "./styles/App.css";

function App() {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route path="/sign-up" element={<SignUpPage />} />
		</Routes>
	);
}

export default App;
