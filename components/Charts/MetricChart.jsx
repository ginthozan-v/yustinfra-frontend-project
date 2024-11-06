import api from '@/api';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Card from '../Card';
import DropdownEditMenu from '../UI/DropdownEditMenu';
import { TrashIcon } from '@heroicons/react/24/solid';

function Metrics({ title, fieldName, deleteCard }) {
  const [value, setValue] = useState(0);
  const router = useRouter();
  const { projectId } = router.query;

  const fetchValue = async () => {
    try {
      const res = await api.project.getMetricsValue(projectId, fieldName);
      setValue(res.sum);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchValue();
  }, []);

  return (
    <Card>
      <div className="px-3 py-2 border-b">
        <header className="flex items-center justify-between">
          <h2 className="font-medium text-[#1E293B]">
            <span className="text-slate-800">{title}</span>
          </h2>

          <button onClick={() => deleteCard()}>
            <TrashIcon className="w-4 h-4 transition-colors cursor-pointer text-slate-300 hover:text-slate-500" />
          </button>

          {/* Menu button */}
          {/* <DropdownEditMenu
            onClick={(e) => e.preventDefault()}
            align="right"
            className="relative inline-flex"
          >
            <li>
              <button
                className="flex px-3 py-1 text-sm font-medium text-slate-600 hover:text-slate-800"
                // onClick={() => action.handleAction(id)}
              >
                Delete
              </button>
            </li>
          </DropdownEditMenu> */}
        </header>
      </div>
      <div className="p-5">
        <div className="text-2xl font-bold text-slate-800">{value}</div>
      </div>
    </Card>
  );
}

export default Metrics;
