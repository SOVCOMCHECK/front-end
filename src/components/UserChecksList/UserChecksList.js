import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../authService';
import styles from './UserChecksList.module.css'; // Импорт CSS-модулей
import {GLOBAL_HOST} from '../../App'

const UserChecksList = () => {
    const [checks, setChecks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChecks = async () => {
            try {
                if (!authService.isAuthenticated()) {
                    throw new Error("Пользователь не аутентифицирован");
                }

                const userId = authService.getUserId();
                if (!userId) {
                    throw new Error("Не удалось получить ID пользователя");
                }

                const response = await fetch(
                    `${GLOBAL_HOST}/checks/users/${userId}?page=${currentPage}&size=6`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Ошибка: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                setChecks(data.content);
                setTotalPages(data.totalPages);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchChecks();
    }, [currentPage]);

    const formatDate = (input) => {
        if (!/^\d{8}t\d{4}$/.test(input)) {
            return '';
        }

        const year = input.slice(0, 4);
        const month = input.slice(4, 6);
        const day = input.slice(6, 8);
        const hour = input.slice(9, 11);
        const minute = input.slice(11, 13);

        return `${day}-${month}-${year} ${hour}:${minute}`;
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleCheckClick = (checkId) => {
        navigate(`/check/${checkId}`);
    };

    if (loading) {
        return <p>Загрузка...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>Ошибка при загрузке данных: {error}</p>;
    }

    if (checks.length === 0) {
        return <p>Чеки не найдены.</p>;
    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.contentWrapper}>
                <div className={styles.infoBlock}>
                    <h2 className={styles.pageTitle}>Список чеков</h2>
                    <ul className={styles.checkList}>
                        {checks.map((check) => (
                            <li
                                key={check.id}
                                className={styles.checkItem}
                                onClick={() => handleCheckClick(check.id)}
                            >
                                <div className={styles.checkItemDetails}>
                                    <strong>Дата:</strong> {formatDate(check.request.manual.check_time)}
                                </div>
                                <div className={styles.checkItemDetails}>
                                    <strong>Сумма:</strong> {check.request.manual.sum} руб.
                                </div>
                                <div className={styles.checkItemDetails}>
                                    <strong>Организация:</strong> {check.data.json.user}
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Пагинация */}
                    <div className={styles.paginationButtons}>
                        <button
                            className={styles.paginationButton}
                            onClick={handlePreviousPage}
                            disabled={currentPage === 0}
                        >
                            {`<`}
                        </button>
                        <span className={styles.paginationCurrentPage}>
                            Страница {currentPage + 1}
                        </span>
                        <button
                            className={styles.paginationButton}
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages - 1}
                        >
                            {`>`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserChecksList;