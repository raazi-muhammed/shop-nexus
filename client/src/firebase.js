import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDxuao-yJkbiFzRzmMcqSVI2stnoqpypWc",
	authDomain: "shop-nexus-auth.firebaseapp.com",
	projectId: "shop-nexus-auth",
	storageBucket: "shop-nexus-auth.appspot.com",
	messagingSenderId: "643468922117",
	appId: "1:643468922117:web:171db3ab214d3d17d07b6c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
