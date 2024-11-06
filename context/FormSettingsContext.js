import api from '@/api';
import { FORM_ROUTE } from '@/constants/routes';
import { getAuthUser } from '@/utils/auth';
import { convertStringToBoolean } from '@/utils/lib';
import { useRouter } from 'next/router';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useUsers } from './UsersContext';

const FormSettingsContext = createContext(null);

export const FormSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState([
    {
      field_name: 'mail_the_creator',
      field_value: false,
      type: 'switch',
      label: 'Email the creator of the form',
    },
    {
      field_name: 'mail_the_submitter',
      field_value: false,
      type: 'switch',
      label: 'Email the submitter of the form',
    },
    {
      field_name: 'mail_to_other',
      field_value: '',
      label: 'Email Address',
      type: 'other',
    },
    {
      field_name: 'doc_type',
      field_value: '',
      type: 'docType',
    },
    {
      field_name: 'mail_to_CC',
      field_value: '',
      label: 'CC Addresses',
      type: 'email',
    },
    {
      field_name: 'mail_to_BCC',
      field_value: '',
      label: 'BCC Addresses',
      type: 'email',
    },
    {
      field_name: 'mail_subject',
      field_value: '',
      label: 'Email subject',
      type: 'text',
    },
    {
      field_name: 'mail_body',
      field_value: '',
      label: 'Email body',
      type: 'long-text',
    },
    {
      field_name: 'header_logo',
      field_value: '',
      label: 'Header Logo',
      type: 'image',
    },
    {
      field_name: 'header_text',
      field_value: '',
      label: 'Header Text',
      type: 'long-text',
    },
    // {
    //   field_name: 'color',
    //   field_value: '',
    //   label: 'Color',
    //   type: 'color',
    // },
    {
      field_name: 'footer_text',
      field_value: '',
      label: 'Footer Text',
      type: 'long-text',
    },
    {
      field_name: 'exclude_display_submitter_from_header',
      field_value: false,
      type: 'switch',
      label: 'Exclude display submitter from header?',
    },
    {
      field_name: 'exclude_submitted_date_time',
      field_value: false,
      type: 'switch',
      label: 'Exclude submitted data/time from header?',
    },
  ]);
  const [deliverySettingsData, setDeliverySettingsData] = useState({
    mail_the_creator: false,
    mail_the_submitter: false,
    mail_to_other: '',
    pdf: false,
    word: false,
    zip: false,
    mail_to_CC: [],
    mail_to_BCC: [],
    mail_subject: '',
    mail_body: '',
  });
  const [templateSettingsData, setTemplateSettingsData] = useState({
    header_text: '',
    color: '',
    footer_text: '',
    exclude_submitted_date_time: false,
    exclude_display_submitter_from_header: false,
  });
  const [settingsData, setSettingsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [settingsValidation, setSettingsValidation] = useState(null);

  const user = getAuthUser();

  const { push, query } = useRouter();
  const { formId } = query;

  const submitBtnRef = useRef(null);

  // const formSubmit = async (value) => {
  //   setIsLoading(true);
  //   try {
  //     const body = {
  //       ...settingsData,
  //       ...value,
  //     };

  //     const promises = Object.keys(body).map(async (key) => {
  //       if (body[key] !== '') {
  //         const formBody = {
  //           field_name: key,
  //           field_value: body[key],
  //           created_at: new Date(),
  //           updated_at: new Date(),
  //           created_by: user.id,
  //           updated_by: user.id,
  //           form_id: formId,
  //         };
  //         await api.form.saveSettings(formBody);
  //       }
  //     });
  //     await Promise.all(promises);
  //     push(FORM_ROUTE).catch((e) => console.log(e));
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   setIsLoading(false);
  // };

  const fetchFormSettings = async () => {
    try {
      const response = await api.form.getSettings(user.id, formId);
      const SETTINGS = [...settings];

      SETTINGS.forEach((setting) => {
        const resSetting = response.find(
          (resSetting) => resSetting.field_name === setting.field_name
        );

        if (resSetting) {
          for (let key in resSetting) {
            if (key !== 'field_name') {
              setting[key] = resSetting[key];
            }
          }
        }
      });

      const deliveryObj = {};
      const templateObj = {};
      Object.keys(deliverySettingsData).forEach((key) => {
        SETTINGS.forEach((setting) => {
          if (key === setting.field_name && setting.field_name !== 'doc_type') {
            deliveryObj[key] = setting.field_value;
          }
          if (
            key === setting.field_name &&
            setting.field_name === 'mail_to_CC'
          ) {
            deliveryObj[key] = setting.field_value.split(',');
          }
          if (
            key === setting.field_name &&
            setting.field_name === 'mail_to_BCC'
          ) {
            deliveryObj[key] = setting.field_value.split(',');
          }
          if (setting.field_value === 'WORD') {
            deliveryObj['word'] = true;
          }
          if (setting.field_value === 'PDF') {
            deliveryObj['pdf'] = true;
          }
          if (setting.field_value === 'PDF+WORD_ZIP') {
            deliveryObj['zip'] = true;
          }
        });
      });
      Object.keys(templateSettingsData).forEach((key) => {
        SETTINGS.forEach((setting) => {
          if (key === setting.field_name && setting.field_name !== 'doc_type') {
            templateObj[key] = setting.field_value;
          }
        });
      });

      setDeliverySettingsData(convertStringToBoolean(deliveryObj));
      setTemplateSettingsData(convertStringToBoolean(templateObj));
      setSettings(SETTINGS);
    } catch (error) {
      console.log(error);
    }
  };

  const value = useMemo(
    () => ({
      deliverySettingsData,
      templateSettingsData,
      settingsData,
      isLoading,
      settings,
      submitBtnRef,
      settingsValidation,
      setDeliverySettingsData,
      setTemplateSettingsData,
      setSettingsData,
      // formSubmit,
      fetchFormSettings,
    }),
    [
      deliverySettingsData,
      templateSettingsData,
      settingsData,
      isLoading,
      settings,
      submitBtnRef,
      settingsValidation,
    ]
  );

  useEffect(() => {
    if (formId) {
      fetchFormSettings().catch((e) => console.log(e));
    }
  }, [formId]);

  useEffect(() => {
    if (
      (deliverySettingsData.mail_the_creator ||
        deliverySettingsData.mail_the_submitter) &&
      deliverySettingsData['mail_subject'] === ''
    ) {
      setSettingsValidation('Email subject is required!');
    } else {
      setSettingsValidation(null);
    }
  }, [deliverySettingsData]);

  return (
    <FormSettingsContext.Provider value={value}>
      {children}
    </FormSettingsContext.Provider>
  );
};

export const useFormSettings = () => {
  return useContext(FormSettingsContext);
};
