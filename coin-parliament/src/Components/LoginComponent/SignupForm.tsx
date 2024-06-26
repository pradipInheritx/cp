import { Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { Callback } from "../../common/models/utils";
import { SignupPayload } from "../../common/models/Login";
import InputField from "../Atoms/Input/InputField";
import { texts, urls } from "./texts";
import Checkbox from "../Atoms/Checkbox/Checkbox";
import { useTranslation } from "../../common/models/Dictionary";
import { Buttons } from "../Atoms/Button/Button";
import { capitalize } from "lodash";
import { User as AuthUser } from "@firebase/auth";
import { Link } from "react-router-dom";

const SignupForm = ({
  emailValue,
  callback,
  signup
}: {
  emailValue:string;
  callback: Callback<User>;
  signup: (
    payload: SignupPayload,
    callback: Callback<AuthUser>
  ) => Promise<void>;
  
}) => {
  const translate = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [agree, setAgree] = useState(true);
useEffect(() => {
  setEmail(emailValue)
}, [])
  const strings = {
    email: capitalize(translate(texts.email)),
    confirmPassword: capitalize(translate(texts.confirmPassword)),
    password: capitalize(translate(texts.password)),
    continue: capitalize(translate(texts.continue)),
    agree: capitalize(translate(texts.agree)),
  };

  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        await signup(
          {
            email,
            password,
            passwordConfirm: password2,
            agree,
          },
          callback
        );
      }}
      className="w-100"
    >
      <Form.Group className="mb-3" controlId="email">
        <InputField
          style={{color:'var(--blue-violet)',boxShadow:window.screen.width>979?'0px 3px 6px #00000029':''}}
          placeholder={translate(strings.email)}
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="password">
        <InputField
          style={{color:'var(--blue-violet)',boxShadow:window.screen.width>979?'0px 3px 6px #00000029':''}}
          placeholder={translate(strings.password)}
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="passwordConfirm">
        <InputField
          style={{color:'var(--blue-violet)',boxShadow:window.screen.width>979?'0px 3px 6px #00000029':''}}
          placeholder={translate(strings.confirmPassword)}
          type="password"
          name="passwordConfirm"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required
        />
      </Form.Group>

      <div className="mt-4 mb-3">
        <Buttons.Primary fullWidth={true} type="submit" >
          {strings.continue}
        </Buttons.Primary>
      </div>

      <Form.Group className="mb-2" controlId="agree">
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
  );
};

export default SignupForm;
