import React, { useEffect, useState } from 'react';
import api from '@/api';
import { useForms } from '@/context/FormContext';
import { getAuthUser } from '@/utils/auth';
import { useRouter } from 'next/router';
import SearchForm from '@/components/UI/SearchForm';
import ReactSelect from '@/components/UI/Select/ReactSelect';
import {
  Bars2Icon,
  Bars4Icon,
  CalendarDaysIcon,
  FilmIcon,
  FingerPrintIcon,
  GlobeEuropeAfricaIcon,
  ListBulletIcon,
  PaperClipIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import {
  AdjustmentsVerticalIcon,
  CheckIcon,
  PencilIcon,
  ListBulletIcon as ListBulletIconSolid,
} from '@heroicons/react/24/solid';

import {
  DATE_FIELD,
  LONG_TEXT_FIELD,
  MULTIPLE_PHOTO_FIELD,
  NUMERIC_FIELD,
  SINGLE_PHOTO_FIELD,
  TEXT_FIELD,
  VIDEO_FIELD,
  SUB_FORM,
  DOCUMENT,
  LOCATION,
  STATIC_TEXT,
  TOGGLE,
  SWITCH,
  RADIO_OPTIONS,
  CHECKBOX_OPTIONS,
  SIGNATURE,
  STATIC_IMAGE,
} from '@/constants/fieldType';

export const FieldSelector = () => {
  const [subForms, setSubForms] = useState([]);
  const user = getAuthUser();

  const { query } = useRouter();
  const { createFormFields, setSelectedSubForm, selectedSubForm } = useForms();

  const fieldItems = [
    {
      title: 'Text',
      fields: [
        { id: 1, Icon: Bars2Icon, text: 'Text', type: TEXT_FIELD },
        { id: 2, Icon: Bars4Icon, text: 'Long Text', type: LONG_TEXT_FIELD },
        { id: 3, Icon: PencilIcon, text: 'Static Text', type: STATIC_TEXT },
      ],
    },
    {
      title: 'Numeric',
      fields: [
        { id: 4, Icon: Bars2Icon, text: 'Numeric', type: NUMERIC_FIELD },
      ],
    },
    {
      title: 'Lists',
      fields: [
        {
          id: 5,
          Icon: ListBulletIcon,
          text: 'Radio List',
          type: RADIO_OPTIONS,
        },
        {
          id: 6,
          Icon: ListBulletIconSolid,
          text: 'Checkbox List',
          type: CHECKBOX_OPTIONS,
        },
      ],
    },
    {
      title: 'Calendar',
      fields: [
        { id: 7, Icon: CalendarDaysIcon, text: 'Date/Time', type: DATE_FIELD },
      ],
    },
    {
      title: 'Multimedia',
      fields: [
        { id: 8, Icon: PhotoIcon, text: 'Static Image', type: STATIC_IMAGE },
        {
          id: 9,
          Icon: PhotoIcon,
          text: 'Single Photo',
          type: SINGLE_PHOTO_FIELD,
        },
        {
          id: 10,
          Icon: PhotoIcon,
          text: 'Multi Photo',
          type: MULTIPLE_PHOTO_FIELD,
        },
        { id: 11, Icon: FilmIcon, text: 'Video', type: VIDEO_FIELD },
      ],
    },
    {
      title: 'Location',
      fields: [
        {
          id: 12,
          Icon: GlobeEuropeAfricaIcon,
          text: 'Location / GPS',
          type: LOCATION,
        },
      ],
    },
    {
      title: 'Boolean fields',
      fields: [
        {
          id: 13,
          Icon: AdjustmentsVerticalIcon,
          text: 'Yes/No',
          type: TOGGLE,
        },
        {
          id: 14,
          Icon: CheckIcon,
          text: 'Switch',
          type: SWITCH,
        },
      ],
    },
    {
      title: 'Other',
      fields: [
        {
          id: 15,
          Icon: FingerPrintIcon,
          text: 'Signature',
          type: SIGNATURE,
        },
        {
          id: 16,
          Icon: PaperClipIcon,
          text: 'Document',
          type: DOCUMENT,
        },
      ],
    },
  ];

  const [search, setSearch] = useState([]);
  const [items, setItems] = useState(fieldItems);

  const fetchSubForms = async () => {
    try {
      const response = await api.form.getAllSubForms(user.id);
      const forms = response?.data?.map((form) => ({
        value: form.id,
        label: form.name ?? 'no title',
      }));
      setSubForms(forms);
    } catch (error) {
      console.log('>>', error);
    }
  };

  useEffect(() => {
    if (query.form_type === 'main_form') {
      fetchSubForms();
    }
  }, [query]);

  useEffect(() => {
    if (search !== '') {
      const result = items.filter((p) =>
        p.fields.some((s) => s.text?.toLocaleLowerCase().includes(search))
      );
      setItems(result);
    } else {
      setItems(fieldItems);
    }
  }, [search]);

  useEffect(() => {
    if (selectedSubForm) {
      createFormFields(SUB_FORM);
    }
  }, [selectedSubForm]);

  return (
    <>
      <div className="px-2 py-4 bg-white border-b border-x lg:border-x-0 border-slate-200">
        <SearchForm
          placeholder="Search..."
          value={search}
          onSearch={setSearch}
        />
      </div>

      <div className="pb-[330px] border-x lg:border-x-0 lg:pb-10 h-full px-2 pt-4 space-y-2 overflow-y-auto no-scrollbar scroll-smooth">
        {items.map(({ title, fields }) => {
          return (
            <div key={title}>
              <p className="px-2 text-sm uppercase text-slate-400">{title}</p>
              {fields.map(({ id, Icon, text, type }) => (
                <FieldItem key={id} Icon={Icon} text={text} type={type} />
              ))}
            </div>
          );
        })}

        {query.form_type === 'main_form' && (
          <div className="">
            <p className="px-2 text-sm uppercase text-slate-400">Misc</p>
            <ReactSelect
              field={{ name: 'sub-form' }}
              options={subForms}
              value={selectedSubForm}
              onSelectChange={(e) => {
                setSelectedSubForm(e);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

const FieldItem = ({ Icon, text, type }) => {
  const { createFormFields } = useForms();
  return (
    <button
      onClick={() => createFormFields(type)}
      className="flex items-center w-full gap-4 p-2 rounded-md cursor-pointer hover:bg-gray-100"
    >
      <Icon className="w-6 h-6 text-slate-600" />
      <p className="text-slate-600">{text}</p>
    </button>
  );
};
