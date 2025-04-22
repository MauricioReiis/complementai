import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import * as S from "./styles";
import * as H from "./helpers";
import api from "../../services/api";
import Loading from "../loading";

const Aside = () => {
  const [filteredPages, setFilteredPages] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const pages = [
    { title: "Página Inicial", url: "/dashboard", icon: "dashboard" },
    { title: "Avaliações", url: "/evaluation", icon: "evaluation" },
    { title: "Atividades", url: "/activities", icon: "activities" },
    { title: "Gerenciamento", url: "/management", icon: "management" },
    { title: "Perfil", url: "/profile", icon: "profile" },
  ];

  const [currentPage, setCurrentPage] = useState(window.location.pathname);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/user/info`)
      .then((response) => {
        setFilteredPages(
          pages.filter((page) => response.data.permissions.includes(page.icon))
        );
      })
      .catch(() => {});
  }, []);

  const handleCLick = (url: string) => () => {
    navigate(url);
    setCurrentPage(url);
  };

  const handleLogout = () => {
    setIsLoading(true);

    setTimeout(() => {
      sessionStorage.clear();
      navigate("/login");
      window.location.reload();
    }, 3000);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <S.AsideContainer>
      <S.ItemsBox>
        {filteredPages?.map((item: any) => (
          <S.Link
            key={item.title}
            selected={currentPage === item.url}
            onClick={handleCLick(item.url)}
          >
            <img src={H.getIcon(item.icon)} alt="aside-icon" />
            {item.title}
          </S.Link>
        ))}
      </S.ItemsBox>
      <S.LogoutBox>
        <S.Link selected={false} onClick={handleLogout}>
          <img src={H.getIcon("logout")} alt="aside-icon" />
          <span>Sair</span>
        </S.Link>
        <S.TextBox>
          <p>Criado e Desenvolvido por</p>
          <p>Maurício Reis ®</p>
          <p>v1.0.0</p>
        </S.TextBox>
      </S.LogoutBox>
    </S.AsideContainer>
  );
};

export default Aside;
