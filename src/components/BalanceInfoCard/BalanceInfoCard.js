import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import styles from './BalanceInfoCard.module.css';
import { GLOBAL_HOST } from '../../App';
import authService from '../../authService';

const BalanceInfoCard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Генерация случайных цветов
  const generateRandomColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
    }
    return colors;
  };

  useEffect(() => {
  console.log(authService.getUserId());
  

    const fetchData = async () => {
      try {
         // Получаем ID пользователя
        const from = '2023-01-01T00:00:00'; // Пример даты "от"
        const to = '2025-12-31T23:59:59'; // Пример даты "до"

        const response = await fetch(
          `${GLOBAL_HOST}/analytics/summary?userId=${authService.getUserId()}&from=${from}&to=${to}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const result = await response.json();

        console.log(result);
        
        const formattedData = Object.entries(result).map(([name, value]) => ({
          name,
          value,
        }));

        setData(formattedData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  } 

  const COLORS = generateRandomColors(data.length);

  const total = data.reduce((acc, item) => acc + item.value, 0);
  const percent = Math.round((data[0]?.value / total) * 100);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Остатки на КС</span>
      </div>

      <div className={styles.content}>
        {/* График */}
        <div className={styles.chartWrapper}>
          <PieChart
            width={window.innerWidth > 768 ? 240 : 180}
            height={window.innerWidth > 768 ? 240 : 180}
          >
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={window.innerWidth > 768 ? 80 : 60}
              outerRadius={window.innerWidth > 768 ? 100 : 80}
              startAngle={90}
              endAngle={-270}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            {/* <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={window.innerWidth > 768 ? 24 : 18}
              fontWeight={600}
              fill="#2E2E2E"
            >
              {percent}%
            </text> */}
          </PieChart>
        </div>

        {/* Легенда */}
        <div className={styles.legendWrapper}>
          {data.map((item, index) => (
            <div key={`legend-${index}`} className={styles.legendItem}>
              <span
                className={styles.dot}
                style={{ backgroundColor: COLORS[index] }}
              ></span>
              <span>{item.name}</span>
              <span className={styles.value}>{item.value}р</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BalanceInfoCard;