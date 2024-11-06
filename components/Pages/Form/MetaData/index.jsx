import Card from '@/components/Card';
import Avatar from '@/components/UI/Avatar/Index';
import { useUsers } from '@/context/UsersContext';
import moment from 'moment';
import React from 'react';

const FormMetaData = ({ props }) => {
  const { users } = useUsers();

  return (
    <Card>
      <div>
        <div className="p-5 border-b">
          <div className="text-sm font-semibold text-[#111827]">
            Form metadata
          </div>
        </div>
        <ul className="p-5 space-y-6">
          <li>
            <h6 className="text-[#A0A0A0] uppercase text-xs font-semibold mb-2">
              submission id
            </h6>
            <p className="text-sm  text-[#475569]">{props?.id}</p>
          </li>
          <li>
            <h6 className="text-[#A0A0A0] uppercase text-xs font-semibold mb-2">
              Submitted by
            </h6>
            <div className="flex items-center justify-between">
              <div className="flex items-center grow">
                <div className="relative mr-3">
                  <Avatar
                    picture={
                      users?.find((x) => x.id === props?.up_user.id)
                        ?.profilePicture ?? null
                    }
                    size="small"
                  />
                </div>
                <div className="truncate">
                  <span className="text-sm text-slate-[#475569]">
                    {props?.up_user.email}
                  </span>
                </div>
              </div>
            </div>
          </li>
          <li>
            <h6 className="text-[#A0A0A0] uppercase text-xs font-semibold mb-2">
              Form name
            </h6>
            <p className="text-sm  text-[#475569]">{props?.form.form_name}</p>
          </li>
          <li>
            <h6 className="text-[#A0A0A0] uppercase text-xs font-semibold mb-2">
              Form ID
            </h6>
            <p className="text-sm  text-[#475569]">{props?.form.id}</p>
          </li>
          <li>
            <h6 className="text-[#A0A0A0] uppercase text-xs font-semibold mb-2">
              submitted on{' '}
            </h6>
            <p className="text-sm  text-[#475569]">
              {moment(props?.created_at).format('DD/MM/YYYY')}
            </p>
          </li>
        </ul>
      </div>
    </Card>
  );
};

export default FormMetaData;
