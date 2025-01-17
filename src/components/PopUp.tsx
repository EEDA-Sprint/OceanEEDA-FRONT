import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "@apollo/client";
import { SIGNIN, SIGNUP } from "../graphql/mutations";

const Popup = ({ mode, onClose, setIsLoggedIn }: { mode: any, onClose: any, setIsLoggedIn: any }) => {
  const [isLogin, setIsLogin] = useState(mode === 1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [signin, { loading: signinLoading, error: signinError }] = useMutation(SIGNIN);
  const [signup, { loading: signupLoading, error: signupError }] = useMutation(SIGNUP);
  const [passwordError, setPasswordError] = useState("");

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  const handleLogin = async () => {
    try {
      const { data } = await signin({
        variables: { email, password },
      });
      localStorage.setItem("accessToken", data.login.accessToken);
      localStorage.setItem("refreshToken", data.login.refreshToken);
      setIsLoggedIn(true);
      onClose();
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }
    setPasswordError("");
    
    try {
      const { data } = await signup({
        variables: { username, email, password },
      });
      console.log("User ID:", data.createUser.id);
      onClose();
    } catch (err) {
      console.error("Signup Error:", err);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <PopupContainer onClick={(e) => e.stopPropagation()}>
        <Title>OceanEEDA</Title>
        <Subtitle>
          {isLogin
            ? <>오션이다에 오신 것을 환영합니다.<br />로그인 후 오션이다의 더 다양한 서비스를 즐겨보세요!</>
            : <>오션이다에 오신 것을 환영합니다.<br />회원가입 후 오션이다의 도우미가 되어주세요!</>}
        </Subtitle>
        {!isLogin && <Input 
          placeholder="사용자 이름을 입력해주세요." 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />}
        <Input 
          placeholder="이메일을 입력해주세요." 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input 
          type="password" 
          placeholder="비밀번호를 입력해주세요." 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {!isLogin && (
          <Input 
            type="password" 
            placeholder="비밀번호를 한 번 더 입력해주세요." 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        {!isLogin && passwordError && <Error>{passwordError}</Error>}
        <Button onClick={isLogin ? handleLogin : handleSignup} disabled={signinLoading || signupLoading}>
          {signinLoading || signupLoading ? "Loading..." : isLogin ? "로그인" : "회원가입"}
        </Button>
        {signinError && <Error>{signinError.message}</Error>}
        {signupError && <Error>{signupError.message}</Error>}
        <Footer>
          {isLogin ? (
            <p>
              아직 계정이 없다면? <a onClick={toggleMode}>회원가입하기</a>
            </p>
          ) : (
            <p>
              이미 계정이 있다면? <a onClick={toggleMode}>로그인하기</a>
            </p>
          )}
        </Footer>
      </PopupContainer>
    </Overlay>
  );
};

export default Popup;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 120;
`;

const PopupContainer = styled.div`
  background: #fff;
  border-radius: 10px;
  width: 650px;
  height: auto;
  padding: 50px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  align-items: center;
  justify-content: center;
`;

const Title = styled.p`
  color: #008e88;
  height: 60px;
  font-size: 2rem;
  font-weight: 1000;
  text-align: center;
`;

const Subtitle = styled.p`
  font-family: "Arial", sans-serif;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 90%;
  padding: 10px;
  margin: 10px 0;
  background-color: #F2F2F2;
  border: none;
  border-radius: 5px;

  &::placeholder {
    color: #999999;
  }
`;

const Button = styled.button`
  width: 90%;
  padding: 10px;
  background-color: #008080;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #006666;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 10px;

  a {
    color: #008080;
    text-decoration: underline;
    cursor: pointer;
  }
`;

const Error = styled.div`
  color: red;
  margin-top: 10px;
`;