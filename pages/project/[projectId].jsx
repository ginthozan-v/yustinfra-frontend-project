import { useState, useEffect } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import RecentModifiedForms from "@/components/Pages/Dashboard/RecentModifiedForms";
import TotalSubmissionCount from "@/components/Pages/Dashboard/TotalSubmissionCount";
import UserActivity from "@/components/Pages/Dashboard/UserActivity";
import Container from "@/components/partials/Container";
import PageHeader from "@/components/partials/PageHeader";

import { CardType } from "@/constants";
import { toast } from "react-hot-toast";
import api from "@/api";
import Toast from "@/components/Toast";
import { useUsers } from "@/context/UsersContext";
import { CREATE_FORM_TEMPLATE_ROUTE } from "@/constants/routes";
import moment from "moment";
import { useRouter } from "next/router";
import Metrics from "@/components/Charts/MetricChart";
import DoughnutCard from "@/components/Charts/DoughnutCard";
import VerticalCard from "@/components/Charts/VerticalCard";
import AddViewRightPanel from "@/components/Template/AddViewRightPanel";
import RenderWidgets from "@/components/Template/RenderWidgets";
import { getAuthUser } from "@/utils/auth";
import ConfirmModal from "@/components/Modal/ConfirmModal";

const ProjectDetail = () => {
  const [addViewRightPanel, setAddViewRightPanel] = useState(false);
  // const [userFormIds, setUserFormIds] = useState([]);
  const [recentModifiedForms, setRecentModifiedForms] = useState([]);
  const [activity, setActivity] = useState([]);
  const [cards, setCards] = useState([]);
  const [searchByDate, setSearchByDate] = useState(null);
  const [isConfirm, setIsConfirm] = useState(false);
  const [cardId, setCardId] = useState(null);

  const user = getAuthUser();
  const { users } = useUsers();
  const router = useRouter();
  const { projectId } = router.query;

  const fetchAllCards = async () => {
    try {
      const response = await api.project.getAllCards(
        projectId,
        "order_by=created_at&order_type=DESC"
      );

      setCards(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRecentForms = async () => {
    try {
      const RES = await api.form.getAllFormsByProjectId(
        projectId,
        "order_by=updated_at&order_type=DESC"
      );

      const FORMS = RES.data.slice(0, 7).map((data) => ({
        id: data.id,
        name: data.form_name,
        editUrl: `${CREATE_FORM_TEMPLATE_ROUTE}?form_type=main_form&formId=${data.form_id}`,
        // viewUrl: `${FORM}/${data.form_id}?createdBy=${data.created_by}`,
      }));

      setRecentModifiedForms(FORMS);
    } catch (error) {
      console.log(error);
    }
  };

  // const fetchProject = async () => {
  //   try {
  //     const response = await api.project.getAllUserProjects(user.id);
  //     console.log('response >>', response.data[0]);

  //     const allUserFormIds = response.data.flatMap((project) =>
  //       project.project_user_forms.map((userForm) => userForm.id)
  //     );
  //     setUserFormIds(allUserFormIds);
  //   } catch (err) {
  //     console.log('>>', err);
  //     toast.custom((t) => (
  //       <Toast
  //         t={t}
  //         title="Error"
  //         message="Something went wrong, Try again later!"
  //         toast={toast}
  //       />
  //     ));
  //   }
  // };

  const fetchUserActivities = async () => {
    try {
      //?filter_date[0]=2023-01-01 12:02:55&filter_date[1]=2023-01-06 12:02:55
      let response = await api.project.getRecentFormSubmissions(projectId);
      const formData = response.detail;
      // filter forms whose id is not included in userFormIds
      // const filteredFormData = formData.filter((item) =>
      //   userFormIds.includes(item.form.id)
      // );

      const userProfiles = await Promise.all(
        formData.map(async (item) => {
          const foundUser = users?.find((x) => x.id === item["up_user.id"]);
          return foundUser;
        })
      );

      const ACTIVITY_ARR = formData.map((form, i) => ({
        id: form["form.id"],
        image: userProfiles[i]?.profilePicture,
        name: form["up_user.first_name"] + " " + form["up_user.last_name"],
        email: form["up_user.email"],
        event: "Data Exported",
        date: moment(form["form.last_date"]).format("DD/MM/YYYY HH:MM"),
        detail: form["form.form_name"],
      }));

      setActivity(ACTIVITY_ARR);
    } catch (err) {
      console.log(">>", err);
      toast.custom((t) => (
        <Toast
          t={t}
          title="Error"
          message="Something went wrong, Try again later!"
          toast={toast}
        />
      ));
    }
  };

  const handleDeleteUser = async (id) => {
    setIsConfirm(true);
    setCardId(id);
  };

  const deleteCard = async () => {
    try {
      await api.project.deleteCard(user.id, cardId);
      fetchAllCards();
      setIsConfirm(false);
      setCardId(null);
    } catch (error) {
      console.log(error);
    }
  };

  const buttonGroup = [
    { name: "add", label: "Add View", icon: "ADD", variant: "filled" },
  ];

  const onClick = () => {
    setAddViewRightPanel(!addViewRightPanel);
  };

  useEffect(() => {
    fetchAllCards();
    // fetchProject();
    fetchUserActivities();
    fetchRecentForms();
  }, [users, projectId]);

  return (
    <>
      <PageHeader
        title="Dashboard"
        isFilter={false}
        isDatePicker={true}
        buttonGroup={buttonGroup}
        onBtnClick={onClick}
        onDateChange={setSearchByDate}
        isBack={true}
      />
      <ConfirmModal
        title="The card will be deleted, are you sure?"
        isOpen={isConfirm}
        setIsOpen={setIsConfirm}
        onYes={deleteCard}
      />
      <Container>
        <div className="grid items-start grid-cols-1 gap-5 grid-flow-dense 2xl:gap-10 md:grid-cols-4">
          {cards.length > 0 &&
            cards.map((props) =>
              RenderWidgets({ ...props }, (v) => handleDeleteUser(v))
            )}

          <div className="md:col-span-2">
            <TotalSubmissionCount
              title="Submission count"
              dateFilter={searchByDate}
            />
          </div>

          {recentModifiedForms && (
            <div className="md:col-span-2">
              <RecentModifiedForms
                title="Recent Modified Forms"
                forms={recentModifiedForms}
              />
            </div>
          )}
          {activity && (
            <div className="md:col-span-4">
              <UserActivity activity={activity} title="User activity" />
            </div>
          )}
        </div>
      </Container>

      <AddViewRightPanel
        addViewRightPanel={addViewRightPanel}
        setAddViewRightPanel={setAddViewRightPanel}
        fetchAllCards={fetchAllCards}
      />
    </>
  );
};

ProjectDetail.Title = "Project";
ProjectDetail.auth = true;
ProjectDetail.Layout = DashboardLayout;
export default ProjectDetail;

const RenderCards = (card) => {
  if (card.form_field_names[0].cart_type === CardType.METRIC) {
    return (
      <Metrics
        key={card.id}
        title={card.card_name}
        fieldName={card.form_field_names[0].field_name.value}
      />
    );
  } else if (card.form_field_names[0].cart_type === CardType.VERTICAL) {
    return (
      <div key={card.id} className="h-full md:col-span-2 md:row-span-2">
        <VerticalCard card={card} />
      </div>
    );
  } else if (card.form_field_names[0].cart_type === CardType.DAUGHNUT) {
    return (
      <div key={card.id} className="h-full md:col-span-2 md:row-span-2">
        <DoughnutCard card={card} />
      </div>
    );
  }
};
