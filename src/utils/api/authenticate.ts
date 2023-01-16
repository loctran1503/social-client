import { app } from "../firebase/config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  LoginByPassWord,
  SignUpByPassword,
  UserResponse,
} from "../../types/authenticate";
import { apiLink } from "./link";
import axios from "axios";
import maleAvatar from "../../assets/avatar.png";
import femaleAvatar from "../../assets/female-avatar.jpg";
import { DefaultResponse } from "../../types";
const auth = getAuth(app);

//********************************************************************************************************** */
//signup
//********************************************************************************************************** */
export const signUpApi = async ({
  email,
  password,
  name,
  gender,
}: SignUpByPassword): Promise<UserResponse> => {
  return await createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {

      const user = userCredential.user;
      const url = apiLink.users.signUp;
      const serverResult = await axios.post<UserResponse>(url, {
        firebaseId: user.uid,
        name,
        avatar: gender === "male" ? maleAvatar : femaleAvatar,
        email,
      });
      if (!serverResult.data.success) {
        return {
          success: false,
          message: serverResult.data.message,
          code: 400,
        };
      }

      //All thing is good
      if (serverResult.data.accessToken)
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${serverResult.data.accessToken}`;

        return serverResult.data;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`errorCode:${errorCode} - errorMessage:${errorMessage}`);
      return {
        success: false,
        message: errorCode,
        code: 500,
      };

      // ..
    });
};

//********************************************************************************************************** */
//login
//********************************************************************************************************** */
export const loginApi = async ({
  email,
  password,
}: LoginByPassWord): Promise<UserResponse> => {
  return await signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed in
      const user = userCredential.user;
      const url = apiLink.users.login;
      const serverResult = await axios.post<UserResponse>(url, {
        firebaseId: user.uid,
        email,
      },{
        withCredentials:true
      });
      if (!serverResult.data.success) {
        return {
          success: false,
          message: serverResult.data.message,
          code: 400,
        };
      }

      //All thing is good
      if (serverResult.data.accessToken)
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${serverResult.data.accessToken}`;

      return serverResult.data;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`errorCode:${errorCode} - errorMessage:${errorMessage}`);
      return {
        success: false,
        message: errorCode,
        code: 500,
      };

      // ..
    });
};

//********************************************************************************************************** */
//logout
//********************************************************************************************************** */
export const logoutApi = async (): Promise<DefaultResponse> => {
  const url = apiLink.users.logout;
  try {
    const serverResult = await axios.post<DefaultResponse>(url);
    axios.defaults.headers.common["Authorization"] = null;
    return {
      success: serverResult.data.success,
      code: serverResult.data.code,
      message: serverResult.data.message,
    };
  } catch (error) {
    return {
      code: 500,
      success: false,
      message: JSON.stringify(error),
    };
  }
};

//********************************************************************************************************** */
//checkAuthenticate
//********************************************************************************************************** */
export const checkAuthenticateApi = async () : Promise<UserResponse> => {
  try {
    const url = apiLink.users.checkAuth;
    axios.defaults.withCredentials=true
    const serverResult = await axios.get<UserResponse>(url);
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${serverResult.data.accessToken}`;
    return serverResult.data;
  } catch (error) {
    return {
      code: 500,
      success: false,
      message: JSON.stringify(error),
    };
  }
};
