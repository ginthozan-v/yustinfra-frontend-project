import { useEffect, useState } from 'react';
import Card from '@/components/Card';
import Table from '@/components/Table';
import { FORM } from '@/constants/endpoints';

const RecentFormSubmission = ({ recent }) => {
  const columns = [
    {
      id: 'source',
      name: 'Source',
    },
    {
      id: 'user',
      name: 'User',
    },
    {
      id: 'date',
      name: 'Date',
    },
    {
      id: 'action',
      actions: [
        {
          id: 'view',
          name: 'View',
        },
      ],
    },
  ];

  return (
    <Card>
      <header className="p-5 border-b border-slate-100">
        <h2 className="font-medium text-[#1E293B]">Recent Form Submission</h2>
      </header>
      {recent && <Table columns={columns} rowData={recent} />}
    </Card>
  );
};

export default RecentFormSubmission;
