import * as S from "./styles";
import * as T from "./types";

const TextArea = ({
  label,
  placeholder,
  onChange,
  value,
  isDisabled,
}: T.TextAreaProps): JSX.Element => {
  return (
    <S.TextAreaContainer>
      <S.Label>{label}</S.Label>
      <S.TextArea
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        disabled={isDisabled}
      />
    </S.TextAreaContainer>
  );
};

export default TextArea;
