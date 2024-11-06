import { useEffect, useState } from 'react';
import api from '@/api';
import { useRouter } from 'next/router';
import DoughnutChart from './DoughnutChart';
import { tailwindConfig } from '@/utils/Utils';
import Card from '../Card';
import { TrashIcon } from '@heroicons/react/24/solid';

const DoughnutCard = ({ card, deleteCard }) => {
  const [total, setTotal] = useState(0);
  const [currentTotal, setCurrentTotal] = useState(0);

  const [chartData, setChartData] = useState(null);
  const router = useRouter();
  const { projectId } = router.query;

  const fetchValue = async () => {
    try {
      const res = await api.project.getDoughnutValue(
        projectId,
        card.form_field_names[0]?.field_name.value,
        card.form_field_names[1]?.field_name.value
      );
      setTotal(card.form_field_names[2]?.field_name.value ?? 0);
      setCurrentTotal(res.result[0]?.sum ?? 0 + res.result[1]?.sum ?? 0);

      setChartData({
        labels: [
          card.form_field_names[0]?.field_name.label,
          card.form_field_names[1]?.field_name.label,
          card.form_field_names[2]?.field_name.label,
        ],
        datasets: [
          {
            data: [
              res.result[0]?.sum ?? 0,
              res.result[1]?.sum ?? 0,
              card.form_field_names[2]?.field_name.value,
            ],
            backgroundColor: [
              tailwindConfig().theme.colors.indigo[500],
              tailwindConfig().theme.colors.blue[400],
              tailwindConfig().theme.colors.indigo[800],
            ],
            hoverBackgroundColor: [
              tailwindConfig().theme.colors.indigo[600],
              tailwindConfig().theme.colors.blue[500],
              tailwindConfig().theme.colors.indigo[900],
            ],
            hoverBorderColor: tailwindConfig().theme.colors.white,
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchValue();
  }, []);

  return (
    <>
      {chartData && (
        <Card>
          <div className="px-3 py-2 border-b">
            <header className="flex items-center justify-between">
              <h2 className="font-medium text-[#1E293B]">{card.card_name}</h2>

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

          <DoughnutChart
            data={chartData}
            width={595}
            height={248}
            currentTotal={currentTotal}
            total={total}
          />
        </Card>
      )}
    </>
  );
};

export default DoughnutCard;
