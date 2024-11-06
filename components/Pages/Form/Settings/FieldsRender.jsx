import api from '@/api';
import ColorPicker from '@/components/UI/ColorPicker';
import DropZone from '@/components/UI/FilePicker/DropZone';
import ReactSelect from '@/components/UI/Select/ReactSelect';
import Switch from '@/components/UI/Switch';
import TextArea from '@/components/UI/TextArea';
import TextInput from '@/components/UI/TextInput';
import { useFormSettings } from '@/context/FormSettingsContext';
import { useUsers } from '@/context/UsersContext';
import { PlusIcon } from '@heroicons/react/24/outline';
import { TrashIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';

export const FieldsRender = (
  { id, field_name, field_value, label, type },
  userId,
  formId,
  setFieldValue,
  values
) => {
  const { setDeliverySettingsData, fetchFormSettings } = useFormSettings();
  const { users, fetchUsers } = useUsers();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedBCCUsers, setSelectedBCCUsers] = useState([]);

  const [additionalMail, setAdditionalMail] = useState(
    field_name === 'mailToOther' && field_value !== ''
  );

  const submit = async (value) => {
    try {
      const formBody = {
        field_name: field_name,
        field_value:
          field_name === 'mail_to_CC' || field_name === 'mail_to_BCC'
            ? value?.map((val) => val.value).join()
            : value,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: userId,
        updated_by: userId,
        form_id: formId,
      };

      if (id) {
        await api.form.updateSettings(userId, id, formBody);
        fetchFormSettings();
      } else {
        await api.form.saveSettings(formBody);
        fetchFormSettings();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSwitch = (values, option) => {
    const value = option.target.id;
    const init = { ...values };

    switch (value) {
      case 'pdf':
        if ('zip' in init) {
          delete init.zip;
        }
        if ('word' in init) {
          delete init.word;
        }
        init['pdf'] = true;
        submit('PDF');
        setDeliverySettingsData(init);
        break;
      case 'word':
        if ('pdf' in init) {
          delete init.pdf;
        }
        if ('zip' in init) {
          delete init.zip;
        }
        init['word'] = true;
        submit('WORD');
        setDeliverySettingsData(init);
        break;
      case 'zip':
        if ('pdf' in init) {
          delete init.pdf;
        }
        if ('word' in init) {
          delete init.word;
        }
        init['zip'] = true;
        submit('PDF+WORD_ZIP');
        setDeliverySettingsData(init);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (field_name === 'mail_to_other' && field_value !== '') {
      setAdditionalMail(true);
    }
  }, [field_value]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0 && field_name === 'mail_to_CC' && values[field_name]) {
      const selectedUsers = [];

      values[field_name]?.forEach((val) => {
        if (val) {
          selectedUsers.push({
            label: users?.find((x) => x.user === val)?.firstName,
            value: val,
          });
        }
      });

      setSelectedUsers(selectedUsers);
    }

    if (
      users.length > 0 &&
      field_name === 'mail_to_BCC' &&
      values[field_name]
    ) {
      const selectedUsers = [];

      values[field_name]?.forEach((val) => {
        if (val) {
          selectedUsers.push({
            label: users?.find((x) => x.user === val)?.firstName,
            value: val,
          });
        }
      });

      setSelectedBCCUsers(selectedUsers);
    }
  }, [values, field_name, users]);

  switch (type) {
    case 'switch':
      return (
        <Switch
          key={field_name}
          label={label}
          name={field_name}
          onChange={(e) => {
            submit(e.target.checked).catch((e) => console.log(e));
            setFieldValue(field_name, e.target.checked);
          }}
        />
      );
    case 'other':
      return (
        <div key={field_name} className="space-y-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setAdditionalMail(!additionalMail)}
              className="flex items-center justify-center w-10 h-10 border rounded"
            >
              <PlusIcon className="w-4 h-4 text-indigo-500" />
            </button>
            <div className="ml-2 text-base text-slate-400">Email other</div>
          </div>
          {additionalMail && (
            <div className="flex items-center h-full gap-2 group">
              <TextInput
                label="Email Addresses (comma seperated)"
                name="mail_to_other"
                type="email"
                onBlur={submit}
              />
              <button
                onClick={() => {
                  submit('');
                  setAdditionalMail(false);
                }}
                className="flex items-center justify-center w-10 h-10 mt-6 bg-gray-100 border rounded"
              >
                <TrashIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-500" />
              </button>
            </div>
          )}
        </div>
      );
    case 'docType':
      return (
        <div key={field_name} className="space-y-4">
          <h5>Select format</h5>
          <Switch
            label="PDF"
            name="pdf"
            onChange={(option) => handleSwitch(values, option)}
          />
          <Switch
            label="Word"
            name="word"
            onChange={(option) => handleSwitch(values, option)}
          />
          <Switch
            label="Package Word, PDF & Media in a zip file"
            name="zip"
            onChange={(option) => handleSwitch(values, option)}
          />
        </div>
      );
    case 'email':
      return (
        <ReactSelect
          key={field_name}
          label={label}
          field={{
            name: field_name,
            value:
              field_name === 'mail_to_BCC'
                ? selectedBCCUsers
                : field_name === 'mail_to_CC' && selectedUsers,
          }}
          options={users?.map((user) => ({
            value: user.user,
            label: user.firstName,
          }))}
          onSelectChange={(e) => {
            submit(e);
          }}
          isMulti={true}
        />
      );
    case 'color':
      return (
        <ColorPicker
          key={field_name}
          label={label}
          name={field_name}
          onBlur={submit}
        />
      );
    case 'text':
      return (
        <TextInput
          key={field_name}
          label={label}
          name={field_name}
          type="text"
          onBlur={submit}
        />
      );
    case 'long-text':
      return (
        <TextArea
          key={field_name}
          label={label}
          name={field_name}
          onBlur={submit}
        />
      );
    case 'image':
      return (
        <DropZone
          key={field_name}
          label={label}
          accepts={'images/*'}
          placeholder={'PNG, JPG, GIF up to 5MB'}
          onChange={submit}
          value={field_value}
        />
      );
    default:
      break;
  }
};
