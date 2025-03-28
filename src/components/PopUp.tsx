import React, { useState } from "react";
import styled from "styled-components";
import { useMutation, useLazyQuery } from "@apollo/client";
import { SIGNIN, SIGNUP } from "../graphql/mutations";
import { GetMyRole } from "@/graphql/query";

const Popup = ({ mode, onClose, setIsLoggedIn, fetchMarkings }: {
  mode: number,
  onClose: () => void,
  setIsLoggedIn: (status: boolean) => void
  fetchMarkings: any
}) => {
  const [isLogin, setIsLogin] = useState(mode === 1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const [signin] = useMutation(SIGNIN);
  const [signup] = useMutation(SIGNUP);
  const [getMyRole] = useLazyQuery(GetMyRole);

  const resetInputs = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUsername("");
    setPasswordError("");
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userName");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");

      const { data: loginData } = await signin({
        variables: { email, password },
      });

      if (!loginData?.login?.accessToken || !loginData?.login?.refreshToken) {
        console.log("로그인 토큰을 받지 못했습니다.");
        return;
      }

      const accessToken = loginData.login.accessToken;
      const refreshToken = loginData.login.refreshToken;

      if (accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        const { data: roleData } = await getMyRole({
          context: {
            headers: {
              authorization: `Bearer ${accessToken}`
            }
          },
          fetchPolicy: "no-cache"
        });
        if (roleData?.getUserByCurrent) {
          const userName = roleData.getUserByCurrent.username || "Unknown User";
          const userRole = roleData.getUserByCurrent.role || "USER";
          const userId = roleData.getUserByCurrent.id;

          localStorage.setItem("userName", userName);
          localStorage.setItem("userRole", userRole);
          localStorage.setItem("userId", userId);
          setIsLoggedIn(true);
          setTimeout(() => {
            onClose();
            fetchMarkings();
            window.location.reload();
          }, 100);
        } else {
          console.log("사용자 정보를 받지 못했습니다.");
        }
      } else {
        console.log("유효하지 않은 토큰입니다.");
        return;
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
      fetchMarkings();
    }
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }
    setPasswordError("");
    setLoading(true);

    try {
      const { data } = await signup({
        variables: { username, email, password },
      });

      if (data?.createUser?.id) {
        alert("회원가입이 완료되었습니다. 로그인해주세요.");
        setIsLogin(true);
        resetInputs(); // 회원가입 완료 후 입력창 초기화
      }
    } catch (err) {
      console.error("Signup Error:", err);
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetInputs(); // 모드 전환 시 입력창 초기화
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
        {!isLogin && (
          <Input
            placeholder="사용자 이름을 입력해주세요."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}
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
        <Button onClick={isLogin ? handleLogin : handleSignup} disabled={loading}>
          {loading ? "처리중..." : (isLogin ? "로그인" : "회원가입")}
        </Button>
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