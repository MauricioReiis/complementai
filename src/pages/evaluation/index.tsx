import { useEffect, useState } from "react";
import { CustomButton } from "../../atoms/CustomButton/index.tsx";
import Input from "../../atoms/Input/index.tsx";
import Select from "../../atoms/Select/index.tsx";

import * as S from "./styles.ts";
import api from "../../services/api.ts";
import { ActivitiesTable } from "../../molecules/ActivitiesTable/index.tsx";
import Loading from "../../molecules/loading/index.tsx";

const Evaluation = () => {
  const [filteredUsers, setFilteredUsers] = useState<any>([]);
  const [users, setUsers] = useState<any>();
  const [courses, setCourses] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState({
    name: "",
    registration: "",
    course: "",
    situation: "",
  });

  const getUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/user");
      const FilterUsers = response.data.filter(
        (user: any) => user.activities.length > 0
      );
      setUsers(FilterUsers);
      setFilteredUsers(FilterUsers);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCourses = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/user/allCourses");
      setCourses(response.data.map((item: any) => item.courseName));
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
    getCourses();

    const reloadUsers = () => getUsers();
    window.addEventListener("activity", reloadUsers);

    return () => {
      window.removeEventListener("activity", reloadUsers);
    };
  }, []);

  const filterUsers = () => {
    if (!users || !filteredUsers) return [];

    return filteredUsers.filter((user: any) => {
      const filterByName = filter.name
        ? user.name.toLowerCase().includes(filter.name.toLowerCase())
        : true;
      const filterByRegistration = filter.registration
        ? user.registration.includes(filter.registration)
        : true;
      const filterByCourse = filter.course
        ? user.courses?.[0]?.courseName === filter.course
        : true;
      const filterBySituation = filter.situation
        ? filter.situation === "Pendente"
          ? user.activities.some(
              (activity: any) => activity.approval === "pending"
            )
          : user.activities.every(
              (activity: any) => activity.approval !== "pending"
            )
        : true;

      return (
        filterByName &&
        filterByRegistration &&
        filterByCourse &&
        filterBySituation
      );
    });
  };

  return isLoading ? (
    <Loading />
  ) : (
    <S.Content>
      <S.PageTitle>Filtrar Atividade(s)</S.PageTitle>

      <S.FilterContainer>
        <S.InputsFilter>
          <Input
            label="Nome do aluno(a)"
            type="text"
            placeholder="Nome"
            onChange={(event) =>
              setFilter({ ...filter, name: event.target.value })
            }
            light={true}
          />
          <Input
            label="Matrícula"
            type="text"
            placeholder="Informe a matrícula"
            onChange={(event) =>
              setFilter({ ...filter, registration: event.target.value })
            }
            light={true}
          />
          <Select
            label="Curso"
            onChange={(event) =>
              setFilter({ ...filter, course: event.target.value })
            }
            options={courses}
            value={filter.course}
          />
          <Select
            label="Situação"
            onChange={(event) =>
              setFilter({ ...filter, situation: event.target.value })
            }
            options={["Pendente", "Finalizado"]}
            value={filter.situation}
          />
        </S.InputsFilter>
        <S.SearchButton>
          <div>
            <CustomButton
              children={isLoading ? "Buscando..." : "Buscar"}
              color="#2D60FF"
              hasborder={false}
              hasIcon={true}
              iconName="search"
              height="2.1875rem"
              onClick={() => {
                setIsLoading(true);
              }}
            />
          </div>
        </S.SearchButton>
      </S.FilterContainer>

      {isLoading ? (
        <p>Carregando dados...</p>
      ) : (
        <ActivitiesTable
          type="evalueateActivity"
          evalueateActivities={filterUsers()}
        />
      )}
    </S.Content>
  );
};

export default Evaluation;
