import { CustomButton } from "../../atoms/CustomButton";
import FileInput from "../../atoms/FileInput";
import Input from "../../atoms/Input";
import Select from "../../atoms/Select";
import TextArea from "../../atoms/TextArea";
import CloseIcon from "../../assets/icons/closeIcon.png";
import AlertIcon from "../../assets/icons/alertIcon.png";

import * as S from "./styles";
import * as H from "./helpers";
import api from "../../services/api";
import { useEffect, useState } from "react";

interface ActivitiesProps {
  type: string;
  handleDelete?: () => void;
  addActivityInitialState?: {};
  initialActivityValues?: {
    id: string;
    approval: string;
    category: string;
    file: string;
    fileName: string;
    workload: string;
    proof: string;
    startDate: string;
    description?: string;
    comments?: string;
  };
  initialCategoryValue?: string;
  initialMeasurerValue?: any;
}

const Modal = ({
  type,
  handleDelete,
  initialActivityValues,
  initialMeasurerValue,
}: ActivitiesProps) => {
  const userId = sessionStorage.getItem("userId");
  const [courseName, setCourseName] = useState("");
  const [fileName, setFileName] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [activityValues, setActivityValues] = useState<any>({
    approval: "pending",
    category: "",
    file: new DataTransfer().files[0] as File,
    workload: "",
    proof: "",
    startDate: "",
    description: "",
    comments: "",
  });

  const [measurerValues, setMeasurerValues] = useState({
    name: "",
    email: "",
    registration: "",
    password: "",
    isAdmin: true,
    permissions: ["dashboard", "evaluation", "profile"],
  });

  useEffect(() => {
    if (initialMeasurerValue) {
      setMeasurerValues((prev) => ({
        ...prev,
        ...initialMeasurerValue,
      }));
    }
  }, []);

  useEffect(() => {
    if (initialActivityValues) {
      setActivityValues((prev: any) => ({
        ...prev,
        ...initialActivityValues,
      }));
      setFileName(initialActivityValues.fileName);
    }
  }, []);

  useEffect(() => {
    api
      .get(`/category`)
      .then((response) => {
        setCategories(response.data.map((item: any) => item.category));
      })
      .catch(() => {});
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setActivityValues((prevValues: any) => ({
      ...prevValues,
      file: file === null ? (new DataTransfer().files[0] as File) : file,
    }));
    setFileName(file === null ? "" : file.name);
  };

  const handleClose = () => {
    dispatchEvent(
      new CustomEvent("closeModal", {
        detail: { isOpenModal: false },
      })
    );
  };

  const handleValues = (value: string, field: string) => {
    setActivityValues({
      ...activityValues,
      [field]: value,
    });
  };

  const handleSubmitActivity = () => {
    if (initialActivityValues) {
      api
        .put(
          `/user/${userId}/activities/${initialActivityValues.id}`,
          activityValues
        )
        .then(() => {
          H.handleAlert("success", "Editado com sucesso!");
          H.refetchItems("activity");
        })
        .catch(() => {
          H.handleAlert("error", "Não foi possível editar!");
        });
    } else {
      const formData = new FormData();
      formData.append("approval", activityValues.approval);
      formData.append("category", activityValues.category);
      formData.append("workload", activityValues.workload);
      formData.append("proof", activityValues.proof);
      formData.append("startDate", activityValues.startDate);
      formData.append("description", activityValues.description);
      formData.append("comments", JSON.stringify(activityValues.comments)); // Se for um array
      if (activityValues.file) {
        formData.append("file", activityValues.file);
      }
      api
        .post(`/user/${userId}/activities`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          H.handleAlert("success", "Salvo com sucesso!");
          let activities = JSON.parse(
            sessionStorage.getItem("activities") || "[]"
          );
          let newActivity = {
            ...activityValues,
            id: response.data.id,
            fileName: activityValues.file.name,
          };
          activities.push(newActivity);
          sessionStorage.setItem("activities", JSON.stringify(activities));
          H.refetchItems("activity");
        })
        .catch(() => {
          H.handleAlert("error", "Não foi possível salvar!");
        });
    }
    handleClose();
  };

  const handleMeasurer = () => {
    if (initialMeasurerValue?.id) {
      api
        .put(`/user/${initialMeasurerValue.id}`, {
          name: measurerValues.name,
          email: measurerValues.email,
          registration: measurerValues.registration,
          password: measurerValues.password,
          isAdmin: measurerValues.isAdmin,
          permissions: measurerValues.permissions,
        })
        .then(() => {
          H.handleAlert("success", "Salvo com sucesso!");
          H.refetchItems("measurer");
        })
        .catch(() => {
          H.handleAlert("error", "Não foi possível salvar!");
        });
    } else {
      api
        .post(`/user`, {
          name: measurerValues.name,
          email: measurerValues.email,
          registration: measurerValues.registration,
          password: measurerValues.password,
          isAdmin: measurerValues.isAdmin,
          permissions: measurerValues.permissions,
        })
        .then(() => {
          H.handleAlert("success", "Salvo com sucesso!");
          H.refetchItems("measurer");
        })
        .catch(() => {
          H.handleAlert("error", "Não foi possível salvar!");
        });
    }
    handleClose();
  };
  const handleCourse = () => {
    api
      .post(`/user/${userId}/course`, { courseName: courseName })
      .then(() => {
        H.handleAlert("success", "Salvo com sucesso!");
        H.refetchItems("course");
      })
      .catch(() => {
        H.handleAlert("error", "Não foi possível salvar!");
      });
    handleClose();
  };

  const handleCategory = () => {
    api
      .post(`/category`, { category: category })
      .then(() => {
        H.handleAlert("success", "Salvo com sucesso!");
        H.refetchItems("category");
      })
      .catch(() => {
        H.handleAlert("error", "Não foi possível salvar!");
      });
    handleClose();
  };

  const handleComments = async () => {
    setActivityValues({ ...activityValues, startDate: "2020-02-12" });
    if (initialActivityValues) {
      await api
        .put(
          `/user/${userId}/activities/${initialActivityValues.id}`,
          activityValues
        )
        .then(() => {
          H.handleAlert("success", "Comentário adicionado com sucesso!");
          H.refetchItems("activity");
        })
        .catch(() => {
          H.handleAlert("error", "Não foi possível adicionar comentário!");
        });
      handleClose();
    }
  };

  switch (type) {
    case "addActivity":
      return (
        <>
          <S.Blur />
          <S.Container>
            <S.SideBarIcon
              src={CloseIcon}
              alt="close-modal-icon"
              onClick={handleClose}
            />
            <S.Title>Cadastrar Atividade Complementar</S.Title>

            <Select
              onChange={(e) => handleValues(e.target.value, "category")}
              label="Categoria da Atividade:"
              options={categories}
              value={activityValues.category}
            />

            <Input
              label="Carga Horária da Atividade (em horas)"
              type="number"
              placeholder="0.0"
              light={true}
              value={activityValues.workload}
              onChange={(e) => handleValues(e.target.value, "workload")}
            />

            <FileInput
              onChange={(e) => handleFileChange(e)}
              fileName={fileName ? fileName : ""}
            />

            <Input
              label="Link do Comprovante (opcional):"
              type="text"
              placeholder="https://example.com.br"
              light={true}
              value={activityValues.proof}
              onChange={(e) => handleValues(e.target.value, "proof")}
            />

            <Input
              label="Data do início da atividade:"
              type="date"
              placeholder=""
              light={true}
              value={
                activityValues.startDate
                  ? activityValues.startDate.slice(0, 10)
                  : ""
              }
              onChange={(e) => handleValues(e.target.value, "startDate")}
            />

            <TextArea
              label="Descreva brevemente a atividade:"
              placeholder=""
              value={activityValues.description}
              onChange={(e) => handleValues(e.target.value, "description")}
            />

            <S.SaveButton>
              <CustomButton
                children="Salvar"
                color="#2D60FF"
                hasborder={false}
                onClick={handleSubmitActivity}
              />
            </S.SaveButton>
          </S.Container>
        </>
      );
    case "addMeasurer":
      return (
        <>
          <S.Blur />
          <S.Container>
            <S.SideBarIcon
              src={CloseIcon}
              alt="close-modal-icon"
              onClick={handleClose}
            />
            <S.Title>Cadastrar novo avaliador</S.Title>

            <Input
              label="Nome: *"
              type="text"
              placeholder=""
              light={true}
              value={measurerValues.name}
              onChange={(e) =>
                setMeasurerValues({ ...measurerValues, name: e.target.value })
              }
            />

            <Input
              label="E-mail: *"
              type="email"
              placeholder="example@example.com"
              light={true}
              value={measurerValues.email}
              onChange={(e) =>
                setMeasurerValues({ ...measurerValues, email: e.target.value })
              }
            />

            <Input
              label="Matrícula: *"
              type="text"
              placeholder=""
              light={true}
              value={measurerValues.registration}
              onChange={(e) =>
                setMeasurerValues({
                  ...measurerValues,
                  registration: e.target.value,
                })
              }
            />

            <Input
              label="Senha: *"
              type="password"
              placeholder=""
              light={true}
              value={measurerValues.password}
              onChange={(e) =>
                setMeasurerValues({
                  ...measurerValues,
                  password: e.target.value,
                })
              }
            />

            <S.ButtonsOption>
              <CustomButton
                children="Fechar"
                color="#000000"
                hasborder={false}
                onClick={handleClose}
              />
              <CustomButton
                children="Salvar"
                color="#2D60FF"
                hasborder={false}
                onClick={handleMeasurer}
              />
            </S.ButtonsOption>
          </S.Container>
        </>
      );
    case "addCourse":
      return (
        <>
          <S.Blur />
          <S.Container>
            <S.SideBarIcon
              src={CloseIcon}
              alt="close-modal-icon"
              onClick={handleClose}
            />
            <S.Title>Cadastrar novo curso</S.Title>

            <Input
              label="Nome: *"
              type="text"
              placeholder=""
              light={true}
              onChange={(event) => setCourseName(event.target.value)}
            />

            <S.ButtonsOption>
              <CustomButton
                children="Fechar"
                color="#000000"
                hasborder={false}
                onClick={handleClose}
              />
              <CustomButton
                children="Salvar"
                color="#2D60FF"
                hasborder={false}
                onClick={handleCourse}
              />
            </S.ButtonsOption>
          </S.Container>
        </>
      );
    case "addCategory":
      return (
        <>
          <S.Blur />
          <S.Container>
            <S.SideBarIcon
              src={CloseIcon}
              alt="close-modal-icon"
              onClick={handleClose}
            />
            <S.Title>Cadastrar nova Categoria</S.Title>

            <Input
              label="Nome: *"
              type="text"
              placeholder=""
              light={true}
              onChange={(event) => setCategory(event.target.value)}
            />

            <S.ButtonsOption>
              <CustomButton
                children="Fechar"
                color="#000000"
                hasborder={false}
                onClick={handleClose}
              />
              <CustomButton
                children="Salvar"
                color="#2D60FF"
                hasborder={false}
                onClick={handleCategory}
              />
            </S.ButtonsOption>
          </S.Container>
        </>
      );
    case "confirmation":
      return (
        <>
          <S.Blur />
          <S.Container>
            <div className="modal-header">
              <S.Title>Deseja excluir essa atividade?</S.Title>
              <S.SideBarIcon src={AlertIcon} alt="close-modal-icon" />
            </div>

            <p>
              Esta ação é irreversível. Se continuar, não será possível desfazer
              essa operação.
            </p>

            <S.ButtonsOption>
              <CustomButton
                children="Fechar"
                color="#000000"
                hasborder={false}
                onClick={handleClose}
              />
              <CustomButton
                children="Continuar"
                color="#2D60FF"
                hasborder={false}
                onClick={handleDelete}
              />
            </S.ButtonsOption>
          </S.Container>
        </>
      );
    case "comments":
      return (
        <>
          <S.Blur />
          <S.Container>
            <S.SideBarIcon
              src={CloseIcon}
              alt="close-modal-icon"
              onClick={handleClose}
            />
            <S.Title>Detalhes da atividade complementar</S.Title>

            <TextArea
              label="Descrição breve da atividade:"
              placeholder=""
              value={activityValues.description}
              isDisabled={true}
              onChange={(e) =>
                setActivityValues({
                  ...activityValues,
                  description: e.target.value,
                })
              }
            />
            <TextArea
              label="Comentário do avaliador:"
              placeholder="Escreva seu Comentário"
              value={activityValues.comments}
              onChange={(e) =>
                setActivityValues({
                  ...activityValues,
                  comments: e.target.value,
                })
              }
            />
            {initialActivityValues && (
              <S.ButtonsOption>
                <CustomButton
                  children="Fechar"
                  color="#000000"
                  hasborder={false}
                  onClick={handleClose}
                />
                <CustomButton
                  children="Continuar"
                  color="#2D60FF"
                  hasborder={false}
                  onClick={() => handleComments()}
                />
              </S.ButtonsOption>
            )}
          </S.Container>
        </>
      );
  }
};

export default Modal;
