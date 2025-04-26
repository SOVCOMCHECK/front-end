import React from 'react';
import { Link } from 'react-router-dom';
import PartnersSlider from '../../components/Slider/PartnersSlider';
import { FileSearch, ScanEye, History } from 'lucide-react';
import BalanceInfoCard from '../../components/BalanceInfoCard/BalanceInfoCard';
import styles from './HomePage.module.css';

function HomePage() {
  return (
    <div className={styles.mainContainer}>
      <PartnersSlider />

      <div className={styles.contentWrapper}>
        {/* Контейнер с кнопками */}
        <div className={styles.buttonsContainer}>
          <Link to="/check" className={styles.button}>
            <ScanEye className={styles.buttonIcon} />
            Загрузить чек
          </Link>
          <Link to="/history" className={styles.button}>
            <History className={styles.buttonIcon} />
            История загрузок
          </Link>
        </div>

        {/* Блок с графиком */}
        <div className={styles.infoBlock}>
          <BalanceInfoCard />
        </div>
      </div>
    </div>
  );
}

export default HomePage;