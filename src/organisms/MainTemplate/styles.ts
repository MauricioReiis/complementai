import { styled } from "styled-components";

export const Container = styled.section`
  @import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");
  * {
    font-family: "Inter", sans-serif;
    font-optical-sizing: auto;
    font-weight: 500;
    font-style: normal;
  }
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const Content = styled.section`
  flex: 1;
  padding: 2rem;
  border-radius: 25px;
  background-color: white;
  margin: 30px;
  box-shadow: 0px 4px 4px 0px #00000040;
`;

export const MainWrapper = styled.div`
  display: flex;
  flex: 1;
  background-color: #E6EFF5;
`;
