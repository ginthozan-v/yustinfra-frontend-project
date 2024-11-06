import DashboardLayout from '@/components/layout/DashboardLayout';
import RecentModifiedForms from '@/components/Pages/Dashboard/RecentModifiedForms';
import Shortcuts from '@/components/Pages/Dashboard/Shortcuts';
import TotalSubmissionCount from '@/components/Pages/Dashboard/TotalSubmissionCount';
import RecentFormSubmission from '@/components/Pages/Dashboard/RecentFormSubmission';
import UserActivity from '@/components/Pages/Dashboard/UserActivity';
import Container from '@/components/partials/Container';
import PageHeader from '@/components/partials/PageHeader';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '@/api';
import Toast from '@/components/Toast';
import moment from 'moment';
import { FORM } from '@/constants/endpoints';
import { getAuthUser } from '@/utils/auth';
import { CREATE_FORM_TEMPLATE_ROUTE } from '@/constants/routes';
import { useUsers } from '@/context/UsersContext';
import AddViewRightPanel from '@/components/Template/AddViewRightPanel';
import RenderWidgets from '@/components/Template/RenderWidgets';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import { COLLECTOR_ROLE } from '@/constants/roles';
import { useRouter } from 'next/router';
const buttonGroup = [
  { name: 'add', label: 'Add View', icon: 'ADD', variant: 'filled' },
];

const Dashboard = () => {
  const [recent, setRecent] = useState();
  const [recentModifiedForms, setRecentModifiedForms] = useState([]);
  const [activity, setActivity] = useState([]);
  const [searchByDate, setSearchByDate] = useState(null);
  const [addViewRightPanel, setAddViewRightPanel] = useState(false);
  const [cards, setCards] = useState([]);
  const [isConfirm, setIsConfirm] = useState(false);
  const [cardId, setCardId] = useState(null);

  const router = useRouter();

  const openViewPanel = () => {
    setAddViewRightPanel(!addViewRightPanel);
  };

  const { users } = useUsers();

  const user = getAuthUser();

  const fetchAllCards = async () => {
    try {
      const response = await api.dashboard.getAllCards(user.id);
      setCards(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRecentForms = async (date) => {
    try {
      const datefilter = date
        ? `?filter_date[0]=${moment(date?.[0]).format(
            'YYYY-MM-DD HH:MM:SS'
          )}&filter_date[1]=${moment(date?.[1]).format('YYYY-MM-DD HH:MM:SS')}`
        : null;

      const RES = await api.form.getAllForms(
        user?.id,
        `order_by=updated_at&order_type=DESC${date ? `&${datefilter}` : ''}`
      );

      const FORMS = RES.data.slice(0, 7).map((data) => ({
        id: data.id,
        name: data.form_name,
        editUrl: `${CREATE_FORM_TEMPLATE_ROUTE}?form_type=main_form&formId=${data.id}`,
        viewUrl: `${FORM}/${data.id}?createdBy=${data.forms_fields_values[0]?.created_by}`,
      }));
      setRecentModifiedForms(FORMS);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRecentSubmissions = async (date) => {
    try {
      const datefilter = date
        ? `?filter_date[0]=${moment(date?.[0]).format(
            'YYYY-MM-DD HH:MM:SS'
          )}&filter_date[1]=${moment(date?.[1]).format('YYYY-MM-DD HH:MM:SS')}`
        : null;

      let response = await api.dashboard.getRecentFormSubmissions(datefilter);
      const formData = response.data;

      const latestFilledFormMap = new Map();
      formData.forEach((obj) => {
        if (
          !latestFilledFormMap.has(obj.form.id) ||
          obj.date > latestFilledFormMap.get(obj.updated_at)
        ) {
          latestFilledFormMap.set(obj.form.id, obj);
        }
      });

      const latestFilledFormArray = Array.from(
        latestFilledFormMap.values()
      ).sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );

      const formArr = latestFilledFormArray.slice(0, 5).map((form) => ({
        id: form.form.id,
        source: form.form.form_name,
        date: moment(form.updated_date).format('DD/MM/YYYY HH:MM'),
        user: form.up_user.first_name,
        link: `${FORM}/${form?.form?.id}?createdBy=${form?.created_by}`,
      }));

      const userProfiles = await Promise.all(
        formData.map(async (item) => {
          const foundUser = users?.find((x) => x.id === item.up_user.id);
          return foundUser;
        })
      );

      // User activities
      const ACTIVITY_ARR = formData.map((form, i) => ({
        id: form.form.id,
        image: userProfiles[i]?.profilePicture,
        name: form.up_user.first_name + ' ' + form.up_user.last_name,
        email: form.up_user.email,
        event:
          form.up_user?.role === COLLECTOR_ROLE
            ? 'Form Filled'
            : 'Form Changed',
        date: moment(form.form.last_date).format('DD/MM/YYYY HH:MM'),
        detail: form.form.form_name,
      }));

      setActivity(ACTIVITY_ARR);
      setRecent(formArr);
    } catch (err) {
      console.log('>>', err);
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

  useEffect(() => {
    fetchAllCards();
    fetchRecentSubmissions();
    fetchRecentForms();
  }, [users]);

  useEffect(() => {
    fetchRecentSubmissions(searchByDate);
    fetchRecentForms(searchByDate);
  }, [searchByDate]);

  return (
    <>
      <PageHeader
        activeState
        title="Dashboard"
        isFilter={false}
        isDatePicker={true}
        onDateChange={setSearchByDate}
        buttonGroup={buttonGroup}
        onBtnClick={openViewPanel}
      />
      <ConfirmModal
        title="The card will be deleted, are you sure?"
        isOpen={isConfirm}
        setIsOpen={setIsConfirm}
        onYes={deleteCard}
      />
      <Container>
        <div className="grid items-start grid-cols-1 gap-5 grid-flow-dense 2xl:gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Shortcuts user={user} />
          </div>

          {cards.length > 0 &&
            cards.map((props) =>
              RenderWidgets({ ...props }, (v) => handleDeleteUser(v))
            )}

          {recentModifiedForms && (
            <div className="md:col-span-2">
              <RecentModifiedForms
                title="Recent Modified Forms"
                forms={recentModifiedForms}
              />
            </div>
          )}

          <div className="h-full md:col-span-2">
            <TotalSubmissionCount
              title="Total Submission count for all forms"
              dateFilter={searchByDate}
            />
          </div>

          <div className="h-full md:col-span-2">
            <RecentFormSubmission recent={recent} />
          </div>

          <div className="h-full md:col-span-4">
            <UserActivity activity={activity} title="User activity" />
          </div>
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

Dashboard.Title = 'Dashboard';
Dashboard.auth = true;
Dashboard.Layout = DashboardLayout;
export default Dashboard;
