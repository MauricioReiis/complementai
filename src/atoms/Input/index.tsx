import * as S from "./styles";
import * as T from "./types";

const Input = ({
  label,
  type,
  placeholder,
  onChange,
  light,
  value,
}: T.InputProps): JSX.Element => {
  return (
    <S.InputContainer>
      <S.Label>{label}</S.Label>
      <S.Input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        light={light}
        value={value}
      />
    </S.InputContainer>
  );
};

export default Input;
