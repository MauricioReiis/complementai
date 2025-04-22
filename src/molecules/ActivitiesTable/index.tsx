import openIcon from "../../assets/icons/openActivityIcon.svg";
import { CustomButton } from "../../atoms/CustomButton";
import { useNavigate } from "react-router-dom";
import trashIcon from "../../assets/icons/trash-icon.png";
import robot from "../../assets/imgs/sadRobot.png";

import * as S from "./styles";
import * as T from "./types";
import * as H from "./helpers";

import { useEffect, useState } from "react";
import api from "../../services/api";
import Modal from "../modal";

interface ActivitiesProps {
  type: string;
  evalueateActivities?: any;
}

export const ActivitiesTable = ({
  type,
  evalueateActivities,
}: ActivitiesProps) => {
  const userId = sessionStorage.getItem("userId");
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("confirmation");
  const [activityValues, setActivityValues] = useState<T.ActivityTableItem>();

  const getActivities = () => {
    if (type === "pendingActivity") {
      api.get(`/user/${userId}`).then((response) => {
        setActivities(response.data.activities);
      });
    } else {
      const activitiesInSession = sessionStorage.getItem("activities");
      if (activitiesInSession) {
        setActivities(JSON.parse(activitiesInSession));
      }
    }
  };
  const handleDeleteActivity = (id: string) => {
    setOpenModal(false);
    api
      .delete(`/user/${userId}/activities/${id}`)
      .then(() => {
        dispatchEvent(
          new CustomEvent("handleAlert", {
            detail: { type: "success", message: "Deletado com sucesso!" },
          })
        );
      })
      .catch(() => {
        dispatchEvent(
          new CustomEvent("handleAlert", {
            detail: { type: "error", message: "Erro ao deletar!" },
          })
        );
      });
  };

  const handleSend = () => {
    if (activities.length > 0) {
      H.handleAlert("success", "Enviado com sucesso!");
      sessionStorage.setItem("activities", JSON.stringify([]));
    }
  };

  useEffect(() => {
    window.addEventListener("closeModal", (event: any) => {
      setOpenModal(event.detail.isOpenModal);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("refetchItems", () => {
      getActivities();
    });
  }, []);

  useEffect(() => {
    getActivities();
  }, [type]);

  switch (type) {
    case "addActivity":
      return (
        <>
          <S.TableWrapper>
            <S.Table maxHeight={false}>
              {activities.length > 0 && (
                <S.TableHeader>
                  <tr>
                    <th>Categoria</th>
                    <th>Carga horária</th>
                    <th>Abrir</th>
                    <th>Remover</th>
                  </tr>
                </S.TableHeader>
              )}
              {activities &&
                activities.map((activity: T.ActivityTableItem, index) => (
                  <S.TableRow key={index}>
                    {openModal && (
                      <Modal
                        type={modalType}
                        handleDelete={() => handleDeleteActivity(activity.id)}
                        addActivityInitialState={activity}
                        initialActivityValues={activityValues}
                      />
                    )}
                    <td>{activity?.category || "Não informada"}</td>
                    <td>{activity.workload} horas</td>
                    <td>
                      <img
                        onClick={() => {
                          setOpenModal(true);
                          setModalType("addActivity");
                          setActivityValues(activity);
                        }}
                        src={openIcon}
                        alt="OpenIcon"
                      />
                    </td>
                    <td>
                      <img
                        onClick={() => {
                          setOpenModal(true);
                          setModalType("confirmation");
                        }}
                        src={trashIcon}
                        alt="trashIcon"
                      />
                    </td>
                  </S.TableRow>
                ))}
              {activities.length === 0 && (
                <S.Wrappper>
                  <p>Nenhuma atividade cadastrada</p>
                  <img src={robot} alt="Imagem de robô" />
                </S.Wrappper>
              )}
            </S.Table>

            <S.SendButton>
              <CustomButton
                children="Enviar"
                color="#2D60FF"
                hasborder={false}
                onClick={handleSend}
                hasIcon={true}
                iconName="upload"
              />
            </S.SendButton>
          </S.TableWrapper>
        </>
      );
    case "pendingActivity":
      return (
        <>
          <S.TableWrapper>
            <S.Table maxHeight={false}>
              {activities.length != 0 && (
                <S.TableHeader>
                  <tr>
                    <th>Categoria</th>
                    <th>Carga horária total</th>
                    <th>Abrir</th>
                    <th>Status</th>
                  </tr>
                </S.TableHeader>
              )}
              {activities &&
                activities.map((activity: any, index) => (
                  <tbody>
                    <S.TableRow key={index}>
                      <>
                        {openModal && (
                          <Modal
                            type="comments"
                            initialActivityValues={activity}
                          />
                        )}
                        <td>{activity.category || "Não informada"}</td>
                        <td>{activity.workload} horas</td>
                        <td>
                          <img
                            onClick={() => setOpenModal(true)}
                            src={openIcon}
                            alt="openIcon"
                          />
                        </td>
                        <S.Status
                          status={
                            activity.approval == "pending"
                              ? "pending"
                              : activity.approval == "true"
                              ? "true"
                              : "false"
                          }
                        >
                          {activity.approval == "pending"
                            ? "Pendente"
                            : activity.approval == "true"
                            ? "Aprovado"
                            : "Rejeitado"}
                        </S.Status>
                      </>
                    </S.TableRow>
                  </tbody>
                ))}
              {activities.length === 0 && (
                <S.Wrappper>
                  <p>Nenhuma atividade cadastrada</p>
                  <img src={robot} alt="Imagem de robô" />
                </S.Wrappper>
              )}
            </S.Table>
          </S.TableWrapper>
        </>
      );
    case "evalueateActivity":
      return (
        <>
          <S.Table maxHeight={false}>
            <S.TableHeader>
              <tr>
                <th>Nome do aluno(a)</th>
                <th>Matrícula</th>
                <th>Curso</th>
                <th>Situação</th>
                <th>Abrir</th>
              </tr>
            </S.TableHeader>
            {evalueateActivities
              ? evalueateActivities.map((user: any) => {
                  console.log(user);
                  return (
                    <S.TableRow key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.registration}</td>
                      <td>{user?.courses?.[0] || "Não informado"}</td>
                      <S.Status
                        status={
                          user.activities.some(
                            (activity: any) => activity.approval === "pending"
                          )
                            ? "pending"
                            : "finished"
                        }
                      >
                        {user.activities.some(
                          (activity: any) => activity.approval === "pending"
                        )
                          ? "Pendente"
                          : "Finalizado"}
                      </S.Status>
                      <td>
                        <img
                          onClick={() => {
                            navigate("/evaluation/view", {
                              state: { studentId: user.id },
                            });
                          }}
                          src={openIcon}
                          alt="openIcon"
                        />
                      </td>
                    </S.TableRow>
                  );
                })
              : []}
          </S.Table>
        </>
      );
  }
};
