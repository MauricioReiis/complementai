import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  height: 100%; 

  p{
    font-weight: bold;
  }
`;

export const Spinner = styled.div`
  border: 0.25rem solid #2D60FF; 
  border-top: 0.25rem solid #E6EFF5;
  border-radius: 50%;
  width: 3.125rem;
  height: 3.125rem;
  animation: ${spin} 2s linear infinite;
`;
