import { useEffect, useState } from "react";
import { CustomButton } from "../../atoms/CustomButton/index.tsx";
import Modal from "../../molecules/modal/index.tsx";
import Trash from "../../assets/icons/trash-icon.png";
import openIcon from "../../assets/icons/openIcon.png";
import trashIcon from "../../assets/icons/trash-icon.png";
import Loading from "../../molecules/loading";

import * as S from "./styles.ts";
import * as H from "./helpers.ts";
import api from "../../services/api.ts";

const Management = () => {
  const userId = sessionStorage.getItem("userId");
  const [selected, setSelected] = useState(0);
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [measurers, setMeasurers] = useState<any>();
  const [courses, setCourses] = useState<any>();
  const [courseId, setCourseId] = useState<string>();
  const [categories, setCategories] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.addEventListener("closeModal", (event: any) => {
      setModal(event.detail.isOpenModal);
      setDeleteModal(false);
      setEditModal(false);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("refetchItems", (event: any) => {
      if (event.detail.type === "course") getCourses();
      if (event.detail.type === "category") getCategory();
      if (event.detail.type === "measurer") getMeasurer();
    });
  }, []);

  const getMeasurer = () => {
    setIsLoading(true);
    api
      .get(`/user`)
      .then((response) => {
        const admUsers = response.data.filter(
          (user: any) => user.isAdmin === true
        );
        setMeasurers(admUsers);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  const getCourses = () => {
    setIsLoading(true);
    api
      .get(`/user/allCourses`)
      .then((response) => {
        setCourses(response.data);
        setIsLoading(false); // Definindo o estado como false após a resposta
      })
      .catch(() => setIsLoading(false)); // Caso ocorra um erro, também desativa o loading
  };

  const getCategory = () => {
    setIsLoading(true);
    api
      .get(`/category`)
      .then((response) => {
        setCategories(response.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  const handleModalType = () => {
    switch (selected) {
      case 0:
        return "addMeasurer";
      case 1:
        return "addCourse";
      case 2:
        return "addCategory";
      default:
        return "addMeasurer";
    }
  };

  useEffect(() => {
    getMeasurer();
    getCourses();
    getCategory();
  }, [selected]);

  const handleDeleteMeasurer = (id: string) => {
    api
      .delete(`/user/${id}`)
      .then(() => {
        H.handleAlert("success", "Deletado com sucesso!");
        getMeasurer();
      })
      .catch(() => {
        H.handleAlert("error", "Não foi possível deletar!");
      });
    setDeleteModal(false);
  };

  const handleDeleteCourse = () => {
    api
      .delete(`/user/${userId}/course/${courseId}`)
      .then(() => {
        H.handleAlert("success", "Deletado com sucesso!");
        H.refetchItems("course");
      })
      .catch(() => {
        H.handleAlert("error", "Não foi possível deletar!");
      });
    setDeleteModal(false);
  };

  const handleDeleteCategory = (id: string) => {
    api
      .delete(`/category/${id}`)
      .then(() => {
        H.handleAlert("success", "Deletado com sucesso!");
        setDeleteModal(false);
        H.refetchItems("category");
      })
      .catch(() => {
        H.handleAlert("error", "Não foi possível deletar!");
      });
    setDeleteModal(false);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <S.Content>
      <S.HeaderOptions>
        <S.TextOptions selected={selected === 0} onClick={() => setSelected(0)}>
          Avaliadores
        </S.TextOptions>
        <S.TextOptions selected={selected === 1} onClick={() => setSelected(1)}>
          Cursos
        </S.TextOptions>
        <S.TextOptions selected={selected === 2} onClick={() => setSelected(2)}>
          Categorias de atividades
        </S.TextOptions>
      </S.HeaderOptions>
      <S.ButtonAndHoursContainer>
        <CustomButton
          children="Adicionar"
          color="#2D60FF"
          hasborder={false}
          onClick={() => {
            setModal(true);
          }}
          hasIcon={true}
          iconName="plus"
        />
      </S.ButtonAndHoursContainer>
      {modal && <Modal type={handleModalType()} />}
      {selected === 0 && (
        <S.CustomTable>
          <thead>
            <tr>
              <th>Nome do avaliador</th>
              <th>E-mail</th>
              <th>Matrícula</th>
              <th>Abrir</th>
              <th>Excluir</th>
            </tr>
          </thead>
          <tbody>
            {measurers
              ? measurers
                  .filter(
                    (measurer: any) =>
                      measurer.name && measurer.email && measurer.registration
                  )
                  .map((measurer: any) => (
                    <tr key={measurer.id}>
                      {deleteModal && (
                        <Modal
                          handleDelete={() =>
                            handleDeleteMeasurer(measurer?.id)
                          }
                          type="confirmation"
                        />
                      )}
                      {editModal && (
                        <Modal
                          type="addMeasurer"
                          initialMeasurerValue={measurer}
                        />
                      )}
                      <td>{measurer.name}</td>
                      <td>{measurer.email}</td>
                      <td>{measurer.registration}</td>
                      <td>
                        <img
                          onClick={() => {
                            setEditModal(true);
                          }}
                          src={openIcon}
                          alt="OpenIcon"
                        />
                      </td>
                      <td>
                        <img
                          onClick={() => {
                            setDeleteModal(true);
                          }}
                          src={trashIcon}
                          alt="trashIcon"
                        />
                      </td>
                    </tr>
                  ))
              : []}
            {measurers?.length === 0 && <p>Nenhum avaliador encontrado.</p>}
          </tbody>
        </S.CustomTable>
      )}

      {selected === 1 && (
        <S.CustomTable>
          <thead>
            <tr>
              <th>Nome do curso</th>
              <th>Excluir</th>
            </tr>
          </thead>
          <tbody>
            {courses
              ? courses
                  .filter((course: any) => course.courseName)
                  .map((course: any) => (
                    <>
                      {deleteModal && (
                        <Modal
                          handleDelete={() => handleDeleteCourse()}
                          type="confirmation"
                        />
                      )}
                      <tr>
                        <td>{course?.courseName}</td>
                        <td>
                          <img
                            onClick={() => {
                              setCourseId(course?.id), setDeleteModal(true);
                            }}
                            src={Trash}
                            alt="trash-icon"
                          />
                        </td>
                      </tr>
                    </>
                  ))
              : []}
            {courses?.length === 0 && <p>Nenhum curso encontrado</p>}
          </tbody>
        </S.CustomTable>
      )}

      {selected === 2 && (
        <S.CustomTable>
          <thead>
            <tr>
              <th>Nome da categoria</th>
              <th>Abrir</th>
              <th>Excluir</th>
            </tr>
          </thead>
          <tbody>
            {categories
              ? categories
                  .filter((category: any) => category.category)
                  .map((category: any) => (
                    <>
                      {deleteModal && (
                        <Modal
                          handleDelete={() =>
                            handleDeleteCategory(category?.id)
                          }
                          type="confirmation"
                        />
                      )}
                      {editModal && <Modal type="addCategory" />}
                      <tr>
                        <td>{category?.category}</td>
                        <td>
                          <img
                            onClick={() => setEditModal(true)}
                            src={openIcon}
                            alt="open-icon"
                          />
                        </td>
                        <td>
                          <img
                            onClick={() => {
                              setDeleteModal(true);
                            }}
                            src={Trash}
                            alt="trash-icon"
                          />
                        </td>
                      </tr>
                    </>
                  ))
              : []}
          </tbody>
        </S.CustomTable>
      )}
    </S.Content>
  );
};

export default Management;
