import { texts } from "./texts";
import React, { FormEvent, useContext, useState } from "react";
import { useTranslation } from "../../common/models/Dictionary";
import { AuthProvider, getAuth, sendPasswordResetEmail, User } from "firebase/auth";
import styled from "styled-components";
import { PoppinsBoldBlueViolet14px, PoppinsMediumBlack12px } from "../../styledMixins";
import { User as AuthUser } from "@firebase/auth";
import { Callback } from "../../common/models/utils";
import NotificationContext, { ToastType } from "../../Contexts/Notification";
import { ToastContent, ToastOptions } from "react-toastify/dist/types";
import { capitalize } from "lodash";
import { Form } from "react-bootstrap";
import InputField from "../Atoms/Input/InputField";
import { Buttons } from "../Atoms/Button/Button";


const SignUp = styled.div`
margin-left:5px;
margin-right:7px;
cursor:pointer;
font-weight:600 !important;
text-decoration:underline;
${PoppinsBoldBlueViolet14px};
`;
const DontHaveAccountText = styled.div`
 color:black;
`;
export type ForgetPasswordProps = {
  setForgetPassword:(s:boolean)=>void;
  setUser: (user?: User | undefined) => void;
  setSignup: (s: boolean) => void;
  authProvider: (
    setUser: (user: AuthUser) => void,
    provider: AuthProvider,
    showToast: (
      content: ToastContent,
      type?: ToastType,
      options?: ToastOptions | undefined
    ) => void
  ) => Promise<void>;
  login: (
    e: FormEvent<HTMLFormElement>,
    callback: Callback<AuthUser>
  ) => Promise<void>;
};

const ForgetPassword = ({ setForgetPassword,setUser, setSignup, authProvider, login }: ForgetPasswordProps) => {
  const translate = useTranslation();
  const { showToast } = useContext(NotificationContext);
  const [email,setEmail]=useState('')
  const strings = {
    email: capitalize(translate(texts.email)),
    password: capitalize(translate(texts.password)),
  };
  const onForgetPasswordClick=()=>{
    const auth = getAuth();
     
sendPasswordResetEmail(auth, email)
  .then(() => {
   
    showToast('Password reset link has been sent to your email.', ToastType.SUCCESS)
    setForgetPassword(false)
    // Password reset email sent!
    // ..
  })
  .catch((error) => {
    console.log(error.message)
    showToast(error.message, ToastType.ERROR)
    // ..
  });

   
  }
  return (
    <>
      <div className="mb-3 w-100">
      <Form
      onSubmit={async (e) => {
        e.preventDefault();
        onForgetPasswordClick()
      }}
    >
      <Form.Group className="mb-3 w-100" controlId="login-email">
        <InputField
        style={{color:'var(--blue-violet)',boxShadow:window.screen.width>979?'0px 3px 6px #00000029':''}}
          fullWidth={true}
          type="email"
          placeholder={strings.email}
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Buttons.Primary  fullWidth={true} type="submit">
      continue
      </Buttons.Primary>
    </Form>
      </div>
      <div className='d-flex'>
      <DontHaveAccountText className="mr-5"> {`${capitalize(translate('Go back to login page?'))} `}</DontHaveAccountText> 
      <SignUp  onClick={() => setForgetPassword(false)}>{`${capitalize(translate('Click here.'))}`}</SignUp>
      </div>
    </>
  );
};

export default ForgetPassword;
