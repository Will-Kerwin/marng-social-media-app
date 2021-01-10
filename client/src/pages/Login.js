import React, { useState, useContext } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/client";

import {useForm} from "../util/hooks";
import {AuthContext} from "../context/auth"
import {LOGIN_USER} from "../util/graphql"

function Login(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const {onChange, onSubmit, values} = useForm(loginUserCallback, {username:"", password:""});

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, {data: {login: userData}}) {
      context.login(userData);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function loginUserCallback(){
    loginUser();
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Login</h1>
        <Form.Input
          label="Username"
          placeholder="Username"
          name="username"
          value={values.username}
          onChange={onChange}
          error={errors.username? true:false}
          type="text"
        />
        <Form.Input
          label="Password"
          placeholder="Password"
          name="password"
          type="password"
          error={errors.password? true:false}
          value={values.password}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
        <ul className="list">
            {(Object.values(errors).map((value) => <li key={value}>{value}</li>))}
        </ul>
      </div>
      )}
    </div>
  );
}



export default Login;
