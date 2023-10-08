import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/user/LoginPage";
import SignUpPage from "./pages/user/SignUpPage";
import ActivationPage from "./pages/user/ActivationPage";
import SellerActivationPage from "./pages/seller/SellerActivationPage";
import "./styles/App.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import HomePage from "./pages/User/HomePage";
import SellerLoginPage from "./pages/seller/SellerLoginPage";
import SellerSignUpPage from "./pages/seller/SellerSignUpPage";
import { useEffect } from "react";
import axios from "axios";
import server from "./server";
import SellerDashboardPage from "./pages/seller/SellerDashboardPage";

function App() {
	/* useEffect(() => {
		console.log("hi");
		axios
			.get(`${server}/user/load-user`, { withCredentials: true })
			.then((data) => {
				console.log(data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []); */
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route path="/sign-up" element={<SignUpPage />} />
			<Route path="/api/v1/activation" element={<ActivationPage />} />
			<Route
				path="/api/v1/seller/activation"
				element={<SellerActivationPage />}
			/>
			<Route path="/seller/login" element={<SellerLoginPage />} />
			<Route path="/seller/sign-up" element={<SellerSignUpPage />} />
			<Route
				path="/seller/dashboard/:shopId"
				element={<SellerDashboardPage />}
			/>
			<Route path="*" element={<HomePage />} />
		</Routes>
	);
}

export default App;
