import AppRoutes from "./routes";
import MainTemplate from "./organisms/MainTemplate";
import LoginTemplate from "./organisms/LoginTemplate";
import { useEffect, useState } from "react";

const App = () => {
  const [isLoginRoute, setIsLoginRoute] = useState<boolean>(false);

  useEffect(() => {
    const pathNames = ["/", "/login", "/register"];
    const isLoginRoute = pathNames.includes(window.location.pathname);
    setIsLoginRoute(isLoginRoute);
  }, []);

  return (
    <>
      {isLoginRoute ? (
        <LoginTemplate>
          <AppRoutes />
        </LoginTemplate>
      ) : (
        <MainTemplate>
          <AppRoutes />
        </MainTemplate>
      )}
    </>
  );
};

export default App;
