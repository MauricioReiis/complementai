import * as S from "./styles";

const Loading = () => {
  return (
    <S.LoadingContainer>
      <p>Carregando informações...</p>
      <S.Spinner />
    </S.LoadingContainer>
  );
};

export default Loading;
