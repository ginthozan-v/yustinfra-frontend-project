import { useEffect, useState } from 'react';
import api from '@/api';
import { useRouter } from 'next/router';
import BarChart from '@/components/BarChart';
import { tailwindConfig } from '@/utils/Utils';
import Card from '../Card';

import { getMonthNumber } from '@/utils/lib';
import { TrashIcon } from '@heroicons/react/24/solid';

const VerticalCard = ({ card, deleteCard }) => {
  const [chartData, setChartData] = useState(null);

  const router = useRouter();
  const { projectId } = router.query;

  const fetchValue = async () => {
    try {
      const res = await api.project.getVerticalValue(
        projectId,
        card.form_field_names[0]?.field_name.value,
        card.form_field_names[1]?.field_name.value
      );

      const months = [];
      const val1 = [];
      const val2 = [];

      res.result.map((res) => {
        months.push(`${getMonthNumber(res.month)}-01-${res.year}`);
      });

      months.forEach((month) => {
        const val = res.result.filter(
          (x) => getMonthNumber(x.month) === Number(month[0])
        );
        if (val[0]) {
          val1.push(val[0].sum);
        }

        if (val[1]) {
          val2.push(val[1].sum);
        }
      });

      setChartData({
        labels: [...new Set(months)],
        datasets: [
          // Blue bars
          {
            label: card.form_field_names[0]?.field_name.label ?? '',
            data: val1,
            backgroundColor: tailwindConfig().theme.colors.indigo[500],
            hoverBackgroundColor: tailwindConfig().theme.colors.indigo[600],
            categoryPercentage: 0.66,
          },
          // Light blue bars
          {
            label: card.form_field_names[1]?.field_name.label ?? '',
            data: val2,
            backgroundColor: tailwindConfig().theme.colors.sky[400],
            hoverBackgroundColor: tailwindConfig().theme.colors.sky[500],
            categoryPercentage: 0.66,
          },
        ],
      });
    } catch (error) {
      console.log('error:', error);
    }
  };

  useEffect(() => {
    fetchValue();
  }, []);

  return (
    <>
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
        {chartData && <BarChart data={chartData} width={595} height={248} />}
      </Card>
    </>
  );
};

export default VerticalCard;
