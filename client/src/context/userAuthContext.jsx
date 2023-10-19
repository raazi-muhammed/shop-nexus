import { createContext, useContext, useEffect, useState } from "react";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	GoogleAuthProvider,
	GithubAuthProvider,
	signInWithPopup,
	sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
	const [user, setUser] = useState("");

	const signUp = (email, password) => {
		return createUserWithEmailAndPassword(auth, email, password);
	};
	const login = (email, password) => {
		return signInWithEmailAndPassword(auth, email, password);
	};
	const logOut = () => {
		return signOut(auth);
	};
	const googleSignIn = () => {
		const googleAuthProvider = new GoogleAuthProvider();
		return signInWithPopup(auth, googleAuthProvider);
	};
	const gitHubSignIn = () => {
		const githubAuthProvider = new GithubAuthProvider();
		return signInWithPopup(auth, githubAuthProvider);
	};
	const forgotPassword = (email) => {
		return sendPasswordResetEmail(auth, email, {
			url: "http://localhost:5173/login",
		});
	};
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
		});
		return () => {
			unsubscribe();
		};
	}, []);
	return (
		<userAuthContext.Provider
			value={{
				user,
				signUp,
				login,
				logOut,
				googleSignIn,
				forgotPassword,
				gitHubSignIn,
			}}>
			{children}
		</userAuthContext.Provider>
	);
}
export function useUserAuth() {
	return useContext(userAuthContext);
}
