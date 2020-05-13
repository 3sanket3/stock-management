import React from "react";
import { Input, message } from "antd";
import { auth } from "firebase/app";
import { useHistory } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import {
  Wrapper,
  StyledButton,
  StyledForm,
  StyledItem,
  StyledH2,
} from "../styles/form";

function Login() {
  const history = useHistory();
  const onFinish = async (values) => {
    try {
      await auth().signInWithEmailAndPassword(values.email, values.password);
      history.replace("/");
    } catch (e) {
      if (e.code === "auth/user-not-found") {
        message.error("Email is not register with the system");
      } else if (e.code === "auth/wrong-password") {
        message.error(e.message);
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Wrapper>
      <StyledForm
        name="basic"
        initialValues={{ email: "", password: "" }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <StyledH2>Login</StyledH2>

        <StyledItem
          name="email"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </StyledItem>

        <StyledItem
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </StyledItem>

        <StyledItem>
          <StyledButton type="primary" htmlType="submit">
            Login
          </StyledButton>
        </StyledItem>
      </StyledForm>
    </Wrapper>
  );
}

export default Login;
