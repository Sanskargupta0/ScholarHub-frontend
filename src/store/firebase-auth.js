import config from '../config';
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider ,TwitterAuthProvider, FacebookAuthProvider, GithubAuthProvider} from "firebase/auth";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey:`${config.apiKey}`,
  authDomain: `${config.authDomain}`,
  projectId: `${config.projectId}`,
  storageBucket: `${config.storageBucket}`,
  messagingSenderId: `${config.messagingSenderId}`,
  appId: `${config.appId}`
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const twitterProvide = new TwitterAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();

export {auth, googleProvider, twitterProvide, facebookProvider, githubProvider};