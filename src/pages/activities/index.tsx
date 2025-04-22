import { useEffect, useState } from "react";
import { CustomButton } from "../../atoms/CustomButton/index.tsx";
import { ActivitiesTable } from "../../molecules/ActivitiesTable/index.tsx";
import Modal from "../../molecules/modal/index.tsx";
import * as S from "./styles.ts";
import * as T from "./types.ts";
import Loading from "../../molecules/loading/index.tsx";

const Activities = () => {
  const [selected, setSelected] = useState(true);
  const [modal, setModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sumActivities, setSumActivities] = useState<T.Activity[]>();

  const getActivities = async () => {
    setIsLoading(true);

    try {
      const activitiesInSession = sessionStorage.getItem("activities");
      if (activitiesInSession) {
        setSumActivities(JSON.parse(activitiesInSession));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getActivities();
  }, []);

  useEffect(() => {
    window.addEventListener("closeModal", (event: any) => {
      setModal(event.detail.isOpenModal);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("refetchItems", () => {
      getActivities();
    });
  }, []);

  const sumWorkload = (activities: T.Activity[]): number => {
    return activities.reduce((total, activity) => {
      return total + Number(activity.workload);
    }, 0);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <S.Content>
      <S.HeaderOptions>
        <S.TextOptions selected={selected} onClick={() => setSelected(true)}>
          Cadastro
        </S.TextOptions>
        <S.TextOptions selected={!selected} onClick={() => setSelected(false)}>
          Status atividades
        </S.TextOptions>
      </S.HeaderOptions>
      {selected && (
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
          <S.HoursText>
            Horas cadastradas:{" "}
            <b>{sumActivities ? sumWorkload(sumActivities) : 0}</b>
          </S.HoursText>
        </S.ButtonAndHoursContainer>
      )}
      <ActivitiesTable type={selected ? "addActivity" : "pendingActivity"} />
      {modal && <Modal type="addActivity" />}
    </S.Content>
  );
};

export default Activities;
