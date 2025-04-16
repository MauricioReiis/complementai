import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "../../../atoms/CustomButton";
import Input from "../../../atoms/Input";
import loginIcon from "../../../assets/icons/logoutIcon.svg";
import * as S from "./styles";
import api from "../../../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (event: any) => {
    event.preventDefault();
    api
      .post("/auth/login", login)
      .then((response) => {
        sessionStorage.setItem("token", response.data.token);
        navigate("/dashboard");
        window.location.reload();
      })
      .catch(() => {});
  };

  return (
    <S.Form onSubmit={handleSubmit} isMeasurer={false}>
      <S.Title>
        <img src={loginIcon} alt="loginIcon" />
        Entrar
      </S.Title>
      <S.InputsWrapper>
        <Input
          label="Email"
          type="email"
          placeholder="exemple@example.com"
          onChange={(event) =>
            setLogin({ ...login, email: event.target.value })
          }
        />
        <Input
          label="Senha"
          type="password"
          placeholder="Senha"
          onChange={(event) =>
            setLogin({ ...login, password: event.target.value })
          }
        />
      </S.InputsWrapper>
      <S.ButtonsWrapper>
        <CustomButton
          children="Logar"
          onClick={() => handleSubmit}
          color="#2D60FF"
          hasborder={false}
          type="submit"
        />
        <CustomButton
          children="Criar conta"
          onClick={() => {
            navigate("/register");
          }}
          color="#1D1D1D"
          hasborder={false}
        />
      </S.ButtonsWrapper>
    </S.Form>
  );
};

export default Login;
