import { styled } from "styled-components";

export const Blur = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: #d9d9d999;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 4;
`;

export const Container = styled.section`
  .modal-header {
    padding-bottom: 1rem;
    border-bottom: 1px solid #b1b1b1;
  }
  display: flex;
  flex-direction: column;
  height: fit-content;
  gap: 1.75rem;
  border-radius: 15px;
  padding: 2.6875rem 2.0625rem;
  z-index: 5;
  background-color: white;
  opacity: 1;
  position: absolute;
  
  @media screen and (max-width: 600px) {
    top: 0;
    left: 0;
  }

  @media screen and (min-width: 600px) and (max-width: 1023px) {
    top: 5rem;
    left: 2rem;
    width: 38.875rem;
    position: fixed;
  }

  @media screen and (min-width: 1024px) {
    top: 5rem;
    left: 20%;
    width: 38.875rem;
    position: fixed;
  }

  @media screen and (min-width: 1440px) {
    top: 5rem;
    width: 60%;
    position: fixed;
  }
`;

export const SideBarIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  position: absolute;
  right: 1.2rem;
  top: 2rem;
  cursor: pointer;

  @media screen and (min-width: 600px) {
    right: 3rem;
    top: 2rem;
  }
`

export const Title = styled.h1`
  font-size: 22px;
  font-weight: 600;
`;

export const SaveButton = styled.div`
  width: 9rem;
  align-self: flex-end;
`;

export const ButtonsOption = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  button {
    width: 9rem;
  }
`;
