import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import styles from './BalanceInfoCard.module.css';

const BalanceInfoCard = () => {
  const data = [
    { name: 'Красота', value: 7000 },
    { name: 'Продукты', value: 18000 },
    { name: 'Спортивные товары', value: 3000 },
  ];

  // Генерация случайных цветов
  const generateRandomColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
    }
    return colors;
  };

  const COLORS = generateRandomColors(data.length);

  const total = data.reduce((acc, item) => acc + item.value, 0);
  const percent = Math.round((data[0].value / total) * 100);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Остатки на КС</span>
      </div>

      <div className={styles.content}>
        {/* График */}
        <div className={styles.chartWrapper}>
          <PieChart
            width={window.innerWidth > 768 ? 240 : 180} // Увеличенная ширина
            height={window.innerWidth > 768 ? 240 : 180} // Увеличенная высота
          >
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={window.innerWidth > 768 ? 80 : 60} // Увеличен внутренний радиус
              outerRadius={window.innerWidth > 768 ? 100 : 80} // Увеличен внешний радиус
              startAngle={90}
              endAngle={-270}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={window.innerWidth > 768 ? 24 : 18} // Увеличен размер текста
              fontWeight={600}
              fill="#2E2E2E"
            >
              {percent}%
            </text>
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