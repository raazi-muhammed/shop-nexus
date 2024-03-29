import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/user/userManagment/LoginPage";
import SignUpPage from "./pages/user/userManagment/SignUpPage";
import ActivationPage from "./pages/user/userManagment/ActivationPage";
import SellerActivationPage from "./pages/seller/SellerActivationPage";
import "./styles/App.scss";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/user/HomePage";
import SellerLoginPage from "./pages/seller/SellerLoginPage";
import SellerSignUpPage from "./pages/seller/SellerSignUpPage";
import SellerDashboardPage from "./pages/seller/SellerDashboardPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import UserChangePassword from "./pages/user/account/UserChangePassword";
import { UserAuthContextProvider } from "./context/userAuthContext";
import ForgotPasswordPage from "./pages/user/account/ForgotPasswordPage";
import ChattingComp from "./components/ChattingComp";

function App() {
    return (
        <>
            <UserAuthContextProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/sign-up" element={<SignUpPage />} />

                    <Route path="/activation" element={<ActivationPage />} />
                    <Route
                        path="/seller/activation"
                        element={<SellerActivationPage />}
                    />
                    <Route path="/seller/login" element={<SellerLoginPage />} />
                    <Route
                        path="/seller/sign-up"
                        element={<SellerSignUpPage />}
                    />
                    <Route
                        path="/seller/dashboard/*"
                        element={<SellerDashboardPage />}
                    />

                    <Route
                        path="/user/change-password"
                        element={<UserChangePassword />}
                    />
                    <Route
                        path="/user/message/:senderId/:receiverId"
                        element={<ChattingComp />}
                    />
                    <Route
                        path="/user/forgot-password"
                        element={<ForgotPasswordPage />}
                    />
                    <Route path="/admin/login" element={<AdminLoginPage />} />
                    <Route
                        path="/admin/dashboard/*"
                        element={<AdminDashboardPage />}
                    />

                    <Route path="/*" element={<HomePage />} />
                </Routes>
            </UserAuthContextProvider>
            <Toaster position="top-right" reverseOrder={true} />
        </>
    );
}

export default App;
