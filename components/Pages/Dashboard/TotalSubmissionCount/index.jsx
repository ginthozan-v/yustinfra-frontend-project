import api from '@/api';
import Card from '@/components/Card';
import LineChart from '@/components/Charts/LineChart';
import { tailwindConfig, hexToRGB } from '@/utils/Utils';
import { getMonthNumber } from '@/utils/lib';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function TotalSubmissionCount({ title, dateFilter }) {
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  const router = useRouter();
  const { projectId, formId } = router.query;

  const colorShades = {
    0: 'indigo',
    1: 'slate',
    2: 'blue',
    3: 'fuchsia',
    4: 'rose',
    5: 'gray',
    6: 'indigo',
    7: 'slate',
    8: 'blue',
    9: 'fuchsia',
    10: 'rose',
    11: 'gray',
  };

  // const chartData = {
  //   labels: ['8-01-2023', '9-01-2023'],
  //   datasets: [
  //     // Indigo line
  //     {
  //       label: 'Mosaic Portfolio',
  //       data: [20, 100],
  //       borderColor: tailwindConfig().theme.colors.indigo[500],
  //       fill: true,
  //       backgroundColor: `rgba(${hexToRGB(
  //         tailwindConfig().theme.colors.blue[500]
  //       )}, 0.08)`,
  //       borderWidth: 2,
  //       tension: 0,
  //       pointRadius: 0,
  //       pointHoverRadius: 3,
  //       pointBackgroundColor: tailwindConfig().theme.colors.indigo[500],
  //       clip: 20,
  //     },
  //     // Yellow line
  //     {
  //       label: 'Expected Return',
  //       data: [100, 40],
  //       borderColor: tailwindConfig().theme.colors.amber[400],
  //       borderDash: [4, 4],
  //       fill: false,
  //       borderWidth: 2,
  //       tension: 0,
  //       pointRadius: 0,
  //       pointHoverRadius: 3,
  //       pointBackgroundColor: tailwindConfig().theme.colors.amber[400],
  //       clip: 20,
  //     },
  //     // gray line
  //     {
  //       label: 'Competitors',
  //       data: [0.7, 30],
  //       borderColor: tailwindConfig().theme.colors.slate[300],
  //       fill: false,
  //       borderWidth: 2,
  //       tension: 0,
  //       pointRadius: 0,
  //       pointHoverRadius: 3,
  //       pointBackgroundColor: tailwindConfig().theme.colors.slate[300],
  //       clip: 20,
  //     },
  //   ],
  // };

  const fetchValue = async (date) => {
    setIsLoading(true);
    try {
      setChartData(null);
      const datefilter = date
        ? `?filter_date[0]=${moment(date?.[0]).format(
            'YYYY-MM-DD HH:MM:SS'
          )}&filter_date[1]=${moment(date?.[1]).format('YYYY-MM-DD HH:MM:SS')}`
        : null;

      let response;

      if (projectId) {
        response = await api.project.getTotalFormSubmissions(
          projectId,
          date ? datefilter : null
        );
      } else if (formId) {
        response = await api.form.getFormSubmissions(formId);
      } else {
        response = await api.dashboard.getTotalFormSubmissions(
          date ? datefilter : null
        );
      }

      let months = [];
      let datasets = [];

      if (date) {
        months.push(moment(date?.[0]).format('MM-DD-YYYY'));
        months.push(moment(date?.[1]).format('MM-DD-YYYY'));
      } else {
        response.detail.map((res) => {
          const monthsArr = `${getMonthNumber(res.month)}-01-${res.year}`;
          months.push(monthsArr);
        });
        months = [...new Set(months)];
      }

      months.forEach((month) => {
        response.detail.forEach((res, i) => {
          if (
            getMonthNumber(res.month) === Number(month[0]) &&
            res.year.toString() === month.substr(month.length - 4)
          ) {
            if (datasets.find((ds) => ds.label === res.name)) {
              datasets
                .find((ds) => ds.label === res.name)
                ?.data?.push(res.count);
            } else {
              datasets.push({
                label: res.name,
                data: [res.count],
                fill: true,
                backgroundColor: `rgba(${hexToRGB(
                  tailwindConfig().theme.colors?.[colorShades[i]][500]
                )}, 0.08)`,
                borderColor:
                  tailwindConfig().theme.colors?.[colorShades[i]][500],
                borderWidth: 2,
                tension: 0,
                pointRadius: 0,
                pointHoverRadius: 3,
                pointBackgroundColor:
                  tailwindConfig().theme.colors?.[colorShades[i]][500],
                month: res.month,
              });
            }
          } else if (getMonthNumber(res.month) > Number(month[0])) {
            if (!datasets.find((ds) => ds.label === res.name)) {
              datasets.push({
                label: res.name,
                data: [0],
                fill: true,
                backgroundColor: `rgba(${hexToRGB(
                  tailwindConfig().theme.colors?.[colorShades[i]][500]
                )}, 0.08)`,
                borderColor:
                  tailwindConfig().theme.colors?.[colorShades[i]][500],
                borderWidth: 2,
                tension: 0,
                pointRadius: 0,
                pointHoverRadius: 3,
                pointBackgroundColor:
                  tailwindConfig().theme.colors?.[colorShades[i]][500],
                month: res.month,
              });
            }
          } else if (getMonthNumber(res.month) < Number(month[0])) {
            if (
              !response.detail.find(
                (dt) =>
                  dt.name === res.name &&
                  getMonthNumber(dt.month) === Number(month[0])
              )
            ) {
              datasets.find((ds) => ds.label === res.name)?.data?.push(0);
            }
          }
        });
      });

      setChartData({
        labels: months,
        datasets: datasets,
      });
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (dateFilter) {
      fetchValue(dateFilter);
    } else {
      fetchValue();
    }
  }, [dateFilter]);

  return (
    <>
      {isLoading && <div className="w-full h-full bg-gray-200 animate-pulse" />}

      {!isLoading && chartData && (
        <Card>
          <header className="p-5 border-b border-slate-100">
            <h2 className="font-medium text-[#1E293B]">{title}</h2>
          </header>

          <LineChart data={chartData} width={595} height={248} />
        </Card>
      )}
    </>
  );
}

export default TotalSubmissionCount;
