import { Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/user/LoginPage";
import SignUpPage from "./pages/user/SignUpPage";
import ActivationPage from "./pages/user/ActivationPage";
import SellerActivationPage from "./pages/seller/SellerActivationPage";
import "./styles/App.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import toast, { Toaster } from "react-hot-toast";

import HomePage from "./pages/User/HomePage";
import SellerLoginPage from "./pages/seller/SellerLoginPage";
import SellerSignUpPage from "./pages/seller/SellerSignUpPage";
import SellerDashboardPage from "./pages/seller/SellerDashboardPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import { useEffect, useState } from "react";
import UserChangePassword from "./pages/user/account/UserChangePassword";

function App() {
	const navigate = useNavigate();
	return (
		<>
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
					path="/seller/dashboard/:shopId/*"
					element={<SellerDashboardPage />}
				/>

				<Route path="/user/change-password" element={<UserChangePassword />} />
				<Route path="/admin/login" element={<AdminLoginPage />} />
				<Route path="/admin/dashboard/*" element={<AdminDashboardPage />} />

				<Route path="*" element={<HomePage />} />
			</Routes>
			<Toaster position="top-right" reverseOrder={true} />
		</>
	);
}

export default App;
