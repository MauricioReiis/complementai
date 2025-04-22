import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "../../../atoms/CustomButton";
import Input from "../../../atoms/Input";
import loginIcon from "../../../assets/icons/logoutIcon.svg";
import * as S from "./styles";
import api from "../../../services/api";
import Loading from "../../../molecules/loading";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await api.post("/auth/login", login);
      sessionStorage.setItem("token", data.token);

      const { data: user } = await api.get("/user/info");
      sessionStorage.setItem("userId", user.id);

      const { permissions } = user;

      let redirectPath = "/dashboard";

      switch (true) {
        case permissions.includes("activities"):
          redirectPath = "/activities";
          break;
        case permissions.includes("evaluation"):
          redirectPath = "/evaluation";
          break;
        case permissions.includes("management"):
          redirectPath = "/management";
          break;
        default:
          redirectPath = "/dashboard";
          break;
      }

      navigate(redirectPath);
      window.location.reload();
    } catch {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <Loading />
  ) : (
    <S.Form onSubmit={handleSubmit} isMeasurer={false}>
      <S.Title>
        <img src={loginIcon} alt="loginIcon" />
        Entrar
      </S.Title>
      <S.InputsWrapper>
        <Input
          label="Email"
          type="email"
          placeholder="name@example.com"
          onChange={(event) =>
            setLogin({ ...login, email: event.target.value })
          }
        />
        <Input
          label="Senha"
          type="password"
          placeholder="senha"
          onChange={(event) =>
            setLogin({ ...login, password: event.target.value })
          }
        />
      </S.InputsWrapper>
      <S.ButtonsWrapper>
        <CustomButton
          children="Logar"
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
