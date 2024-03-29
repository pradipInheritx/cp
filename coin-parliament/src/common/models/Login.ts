import {
  AuthProvider,
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  getAdditionalUserInfo,
  // TwitterAuthProvider,
  User as AuthUser,
  getMultiFactorResolver,
  PhoneAuthProvider,
  RecaptchaVerifier,
} from "firebase/auth";

import { FormEvent } from "react";
import { Callback } from "./utils";
import { ToastType } from "../../Contexts/Notification";
import { ToastContent, ToastOptions } from "react-toastify/dist/types";
import { saveUsername } from "../../Contexts/User";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { userConverter, UserProps } from "./User";
import { useNavigate } from "react-router-dom";
import { SignupRegularForSportParliament } from "./SportParliamentLogin";
import { SignupRegularForStockParliament } from "./StockParliamentLogin";
import { toast } from "react-toastify";
import { showToast } from "App";
import { SignupRegularForVotingParliament } from "./VotingParliamentLogin";
import axios from "axios";
const sendEmail = httpsCallable(functions, "sendEmail");
const sendEmailVerificationLink = httpsCallable(functions, "sendEmailVerificationLink");

export enum LoginModes {
  LOGIN,
  SIGNUP,
}

export enum LoginProviders {
  GOOGLE = " Google",
  // FACEBOOK = "facebook",
  // TWITTER = "twitter",
}

export const providers = {
  // [LoginProviders.FACEBOOK]: new FacebookAuthProvider(),
  [LoginProviders.GOOGLE]: new GoogleAuthProvider(),
  // [LoginProviders.TWITTER]: new TwitterAuthProvider(),
};

export const Logout = (setUser?: () => void) => {  
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      window.localStorage.setItem('mfa_passed', 'false');
      if (setUser) {
        setUser();        
      }
    })
    .catch((error) => {
      const errorMessage = error.message;      
      console.log(errorMessage);
    });
};

export const LoginAuthProvider = async (
  setUser: (user: AuthUser) => void,
  provider: AuthProvider,
  showToast: (
    content: ToastContent,
    type?: ToastType,
    options?: ToastOptions | undefined,

  ) => void,
  setSmsVerification?: (s: string) => void,
  callback?: (s: any) => void,
  refer?: any,
) => {
  const auth = getAuth();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (auth?.currentUser?.photoURL === 'mfa') {
      localStorage.setItem('mfa_passed', 'false');
    } else {
      localStorage.setItem('mfa_passed', 'false');
    }
    const isFirstLogin = getAdditionalUserInfo(result)
    const userRef = doc(db, "users", user.uid);
    const userinfo = await getDoc<UserProps>(userRef.withConverter(userConverter));
    const info = userinfo.data();
    // await sendEmail().then(()=>console.log('welcome mail')).catch(err=>console.log('welcome error',err))
    if (callback) {

      // console.log('callback called for refeer',user)
      callback({ parent: refer, child: user.uid })
    }
    await sendEmailVerificationLink({
      email: user.email,
    })
    if (isFirstLogin?.isNewUser) {
      // saveUsername(user.uid, '', '')

      const firstTimeLogin: Boolean = true

      await setDoc(userRef, { firstTimeLogin ,isVoteToEarn: false }, { merge: true });
      console.log('firsttimelogin success')
      setTimeout(() => {

        setUser(user);
      }, 100);
    } else {

      console.log('user', info)
      // @ts-ignore
      if (info?.mfa) {

        console.log('datacalled')
        // @ts-ignore
        setSmsVerification(true)
      }
      // setUser(user);

    }

    console.log("login with google")
    if (user.uid) {      
      let country = "";
      await axios.get("https://ipapi.co/json/")
        .then((response: any) => {
          country = response?.data?.country_name;
        })
        .catch((error) => {
          console.log(error);
        });
      await setDoc(userRef, { country }, { merge: true });
    }
  } catch (e) {
    console.log(e, "check this error 2")
    // @ts-ignore

    if (e?.code == 'auth/multi-factor-auth-required') {
      // The user is a multi-factor user. Second factor challenge is required.
      // @ts-ignore
      const resolver = getMultiFactorResolver(auth, e);

      const phoneInfoOptions = {
        multiFactorHint: resolver?.hints[0],
        session: resolver?.session
      };
      // console.log('phonebook',phoneInfoOptions)
      const phoneAuthProvider = new PhoneAuthProvider(auth);
      const recaptchaVerifier = new RecaptchaVerifier(
        "loginId",
        {
          size: "invisible",
          callback: function () {
            // reCAPTCHA solved, you can proceed with
            // phoneAuthProvider.verifyPhoneNumber(...).
            // onSolvedRecaptcha();

          },
        },
        auth
      );
      // console.log('captcha',recaptchaVerifier)
      phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier)
        .then(function (verificationId) {
          // @ts-ignore
          setSmsVerification({ verificationId, resolver })

          // verificationId will be needed for sign-in completion.
        }).catch(err => console.log('captcha', err));
      //   ...
    }
    // @ts-ignore
    if (e?.code == "auth/popup-closed-by-user" || e?.code == "auth/cancelled-popup-request") {
      const showError = 'Authentication popup was closed by the user'
      showToast(showError, ToastType.ERROR)
    }
    // else {
    //   const errorMessage = (e as Error).message;
    //   let showError = '';
    //   console.log('error message', errorMessage)
    //   if (errorMessage === 'Firebase: Error (auth/popup-closed-by-user).' || errorMessage === 'Error (auth/cancelled-popup-request).') {
    //     showError = 'Authentication popup was closed by the user'
    //   }else {
    //     showError = errorMessage
    //   }
    //   showToast(showError, ToastType.ERROR)
    //   // showToast((errorMessage == 'Firebase: Error (auth/popup-closed-by-user).' || errorMessage == 'Error (auth/cancelled-popup-request).') ? 'Authentication popup was closed by the user' : errorMessage, ToastType.ERROR);
    // }
  }
};

const getValue = (e: FormEvent<HTMLFormElement>, name: string) => {
  return (
    (e.target as HTMLFormElement).elements.namedItem(name) as HTMLInputElement
  ).value;
};

export const LoginRegular = async (
  e: FormEvent<HTMLFormElement>,
  callback: Callback<AuthUser>
) => {
  e.preventDefault();
  const auth = getAuth();
  const email = getValue(e, "email");
  const password = getValue(e, "password");
  var showErroe = false;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log(userCredential, "userCredential");
    if (auth?.currentUser?.photoURL === 'mfa') {
      localStorage.setItem('mfa_passed', 'false');
    } else {
      localStorage.setItem('mfa_passed', 'false');
    }
    const isFirstLogin = getAdditionalUserInfo(userCredential)
    // console.log('firsttimelogin',isFirstLogin)   
    let country = "";
    await axios.get("https://ipapi.co/json/")
      .then((response: any) => {
        country = response?.data?.country_name;
      })
      .catch((error) => {
        console.log(error);
      });
    const userRef = doc(db, "users", userCredential?.user?.uid);
    await setDoc(userRef, { country }, { merge: true });
    
    
    if (auth?.currentUser?.emailVerified) {
      if (isFirstLogin?.isNewUser) {
        saveUsername(userCredential?.user?.uid, '', '')

        const firstTimeLogin: Boolean = true
        const userRef = doc(db, "users", userCredential?.user?.uid);
        await setDoc(userRef, { firstTimeLogin }, { merge: true });
        console.log(isFirstLogin, 'firsttimelogin success')
        // await sendEmail();
        setTimeout(() => {
          callback.successFunc(userCredential.user)
        }, 100);
      } else {
        callback.successFunc(userCredential.user)
      }
    }
    else callback.errorFunc({ message: 'Please verify your email first.' } as Error);
  } catch (err) {


    // @ts-ignore
    console.log(err.message, "allcode")
    // @ts-ignore
    switch (err.code) {
      case 'auth/wrong-password':

        callback.errorFunc({ message: 'Your password is invalid.' } as Error);
        break;
      case 'auth/user-not-found':

        callback.errorFunc({ message: 'This user not found' } as Error);
        break;
      case 'auth/too-many-requests':
        callback.errorFunc({ message: 'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later .' } as Error);
        break;
      case 'auth/invalid-email':
        callback.errorFunc({ message: 'This Email is not Valid.' } as Error);
        break;
      // @ts-ignore      
      default: showErroe = true;
    }

    // @ts-ignore    
    const matches = err.code.replace("auth/", "");
    const lastmatches = matches.replace(/\b(?:-)\b/gi, " ");
    if (showErroe) {
      callback.errorFunc({ message: lastmatches } as Error);
      showErroe = false
    }
  }
};

export const validateSignup = (payload: SignupPayload) => {
  const email = payload.email;
  const password1 = payload.password;
  const password2 = payload.passwordConfirm;
  if (password1 !== password2) {
    throw new Error("Passwords are not equal");
  }

  if (!payload.agree) {
    throw new Error("You must agree to t&c");
  }

  if (!email) {
    throw new Error("Email is required");
  }

  if (!password1) {
    throw new Error("Password is required");
  }

  return true;
};

export const SignupRegular = async (
  payload: SignupPayload,
  callback: Callback<AuthUser>
) => {
  const auth = getAuth();
  try {
    validateSignup(payload);
    console.log("this function call")
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      payload.email,
      payload.password
    );
    // @ts-ignore
    // await sendEmailVerification(auth?.currentUser).then((data) => {
    //   showToast("Successfully sent  verification link on your mail");
    // });


    await sendEmailVerificationLink({
      email: payload.email,
    })
    const firstTimeLogin: Boolean = true
    // @ts-ignore

    const userRef = doc(db, "users", auth?.currentUser?.uid);
    await setDoc(userRef, { firstTimeLogin ,isVoteToEarn: false }, { merge: true })
    console.log('firsttimelogin success')
    // @ts-ignore
    // saveUsername(auth?.currentUser?.uid, '', '')
    // showToast("User register successfully.", ToastType.SUCCESS);
    showToast("Successfully sent  verification link on your mail", ToastType.SUCCESS);
    // Logout(); 
    // @ts-ignore
    callback.successFunc(auth?.currentUser);

    return true;
  } catch (e) {
    // callback.errorFunc(e as Error);

    // @ts-ignore
    const matches = e.code.replace("auth/", "");
    const lastmatches = matches.replace(/\b(?:-)\b/gi, " ");
    callback.errorFunc({ message: lastmatches } as Error);
    return false;
  }
};

export const genericLogin = async (payload: SignupPayload, callback: Callback<AuthUser>) => {
  SignupRegular(payload, callback).then(async (res) => {
    if (res) {
      await SignupRegularForSportParliament(payload, callback);
      await SignupRegularForStockParliament(payload, callback);
      await SignupRegularForVotingParliament(payload, callback);
    }
  }).catch(() => {

  });
}

export type SignupPayload = {
  email: string;
  password: string;
  passwordConfirm: string;
  agree: boolean;
};
