import React, { useContext, useState } from "react";
import SignupForm from "./SignupForm";
import { texts, urls } from "./texts";
import {  useTranslation } from "../../common/models/Dictionary";
import { AuthProvider, User } from "firebase/auth";
import { LoginProviders, providers, SignupPayload } from "../../common/models/Login";
import { Callback } from "../../common/models/utils";
import { User as AuthUser } from "@firebase/auth";
import NotificationContext, { ToastType } from "../../Contexts/Notification";
import styled from "styled-components";
import { PoppinsBoldBlueViolet14px, PoppinsMediumBlack12px } from "../../styledMixins";
import LoginWith from "./LoginWith";
import { ToastContent, ToastOptions } from "react-toastify";
import { Form } from "react-bootstrap";
import InputField from "../Atoms/Input/InputField";
import { capitalize } from "lodash";
import { Buttons } from "../Atoms/Button/Button";
import Checkbox from "../Atoms/Checkbox/Checkbox";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase";
import UserContext from "../../Contexts/User";
import AppContext from "../../Contexts/AppContext";

const Login = styled.div`
  margin-left:5px;
  margin-right:7px;
  cursor:pointer;
  font-weight:600 !important;
  // text-decoration:underline;
  ${PoppinsBoldBlueViolet14px};
`;
const OR = styled.div`
  ${PoppinsMediumBlack12px};
  min-height: 19px;
  align-self: center;
  letter-spacing: 0;
  line-height: 11px;
  white-space: nowrap;
  text-transform: uppercase;
`;
const HaveAccountText = styled.div`
 color:black;
`;


export type SignupProps = {
  setUser: (user?: User | undefined) => void;
  setSignup: (s: boolean) => void;
  signup: (
    payload: SignupPayload,
    callback: Callback<AuthUser>
  ) => Promise<void>;
  authProvider: (
    setUser: (user: AuthUser) => void,
    provider: AuthProvider,
    showToast: (
      content: ToastContent,
      type?: ToastType,
      options?: ToastOptions | undefined
    ) => void
  ) => Promise<void>;
};
const assign = httpsCallable(functions, "assignReferrer");
const Signup = ({ setUser, setSignup, signup ,authProvider}: SignupProps) => {
  const translate = useTranslation();
  const { showToast } = useContext(NotificationContext);
  const {setLogin} = useContext(AppContext );
  const [signupWithProviders,setSignupWithProviders]=useState(true)
  const [email,setEmail]=useState('')
  const [agree, setAgree] = useState(true);
  const { user, userInfo } = useContext(UserContext);
  const[smsVerification,setSmsVerification]=useState('')
  let navigate = useNavigate();
  const search = useLocation().search;
  const refer = new URLSearchParams(search).get("refer");
  
  const strings = {
    email: capitalize(translate(texts.email)),
    confirmPassword: capitalize(translate(texts.confirmPassword)),
    password: capitalize(translate(texts.password)),
    continue: capitalize(translate(texts.continue)),
    agree: capitalize(translate(texts.agree)),
  };
  // const assignReferrer =  (params: User) => {
  //   const assign = httpsCallable(functions, "assignReferrer");
  //    assign({parent: refer, child: params.uid});
  //   setLogin(true);
  //   // navigate("/");
  // };
  // https://us-central1-coinparliament-51ae1.cloudfunctions.net/assignReferrer
  return (
    <> 
     {signupWithProviders? <>{Object.values(LoginProviders).map((provider, i) => {
        return (
          <div key={i} className="mb-2 w-100">
            <LoginWith
              provider={provider}
              onClick={() =>
                // @ts-ignore
                {agree? refer?authProvider(setUser, providers[provider], showToast,setSmsVerification, assign,refer):authProvider(setUser, providers[provider], showToast,setSmsVerification):showToast('You must agree to t&c', ToastType.ERROR)}
              }
            />
          </div>
        );
      })}
      <div className="my-3 align-self-center">
        <OR className="mx-auto">{translate("or")}</OR>
      </div>
        <Form
      onSubmit={async (e) => {
        e.preventDefault();
        setEmail(((e.target as HTMLFormElement).elements.namedItem('email') as HTMLInputElement).value)
      setSignupWithProviders(false)
      }}
      className="w-100"
    >
        <Form.Group className="mb-3 w-100" controlId="login-email">
        <InputField
          style={{color:'var(--blue-violet)',boxShadow:window.screen.width>979?'0px 3px 6px #00000029':''}}
          fullWidth={true}
          type="email"
          placeholder={strings.email}
          name="email"
          required
        />
      </Form.Group>
      <div className="my-1">
        <Buttons.Primary fullWidth={true} type="submit"  >
          {strings.continue}
        </Buttons.Primary>
      </div>
      <Form.Group className="mb-2 mt-3" controlId="agree">
        <Checkbox name="agree" checked={agree} onClick={() => setAgree(!agree)}>
          {translate(strings.agree)
            .split("{terms & conditions}")
            .map((t, i) => (
              <React.Fragment key={i}>
                {t}{" "}
                {!i && (
                  <Link to={urls.termsConditions} style={{color: 'var(--blue-violet)'}}>
                    {translate(texts.termsConditions)}
                  </Link>
                )}
              </React.Fragment>
            ))}
        </Checkbox>
      </Form.Group>
      </Form> 
     
      </>
      
      
      :
      <SignupForm
      emailValue={email}
        signup={signup}
        callback={{
          successFunc:async (params) => {
            console.log('params',params.uid)
            if(refer)  await assign({parent: refer, child: params.uid});
            setSignup(false)
            setLogin(true)
            
          },
            
          errorFunc: (e) => showToast(e.message, ToastType.ERROR),
        }}
      />}
       <div className='d-flex'>
      <HaveAccountText className="mr-5"> {`${capitalize(translate(texts.haveAccount))} `}</HaveAccountText>
      <Login  onClick={() => setSignup(false)}>{`${capitalize(translate(texts.login))}`}</Login>
      </div>
    </>
  );
};

export default Signup;
