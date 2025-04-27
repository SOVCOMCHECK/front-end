import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './CheckDetails.module.css';
import {GLOBAL_HOST} from '../../App'

const CheckDetails = () => {
    const { id } = useParams(); // Получаем ID чека из URL
    const navigate = useNavigate();
    const [checkData, setCheckData] = useState(null); // Данные чека
    const [isLoading, setIsLoading] = useState(true); // Состояние загрузки
    const [error, setError] = useState(null); // Ошибка
    const [showHtml, setShowHtml] = useState(false); // Флаг для отображения HTML

    useEffect(() => {
        const fetchCheckData = async () => {
            try {
                setIsLoading(true);

                // Запрос на сервер для получения данных чека
                const response = await fetch(`${GLOBAL_HOST}/checks/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Ошибка: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();

                console.log(data);

                setCheckData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCheckData();
    }, [id]);

    // Переключение между изображением и HTML
    const toggleView = () => {
        setShowHtml((prev) => !prev);
    };

    if (isLoading) {
        return <p>Загрузка...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>Ошибка при загрузке данных: {error}</p>;
    }

    if (!checkData) {
        return <p>Чек не найден.</p>;
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Просмотр чека</h2>

            {/* Кнопка переключения между изображением и HTML */}
            <button onClick={toggleView} className={styles.toggleButton}>
                {showHtml ? 'Показать изображение' : 'Показать скан'}
            </button>

            {/* Отображение изображения или HTML */}
            {showHtml ? (
                <div
                    className={styles.htmlContainer}
                    dangerouslySetInnerHTML={{ __html: checkData.data?.html || '' }}
                />
            ) : (
                <div className={styles.imageContainer}>
                    <img
                        src={checkData.imageUrl}
                        alt="Чек"
                        className={styles.checkImage}
                    />
                </div>
            )}

            {/* Кнопка возврата к списку чеков */}
            <button onClick={() => navigate('/history')} className={styles.backButton}>
                Вернуться к списку чеков
            </button>
        </div>
    );
};

export default CheckDetails;