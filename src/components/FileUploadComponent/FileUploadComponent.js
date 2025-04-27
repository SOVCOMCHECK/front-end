import React, { useState } from 'react';
import styles from './FileUploadComponent.module.css';
import authService from '../../authService'; // Импортируем getUserId из вашего сервиса аутентификации
import { useNavigate } from 'react-router-dom'; // Для навигации
import {GLOBAL_HOST} from '../../App'

const FileUploadComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [serverResponse, setServerResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [checkId, setCheckId] = useState(null); // ID чека для подтверждения/отмены
  const navigate = useNavigate(); // Для навигации

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('Файл не выбран');
      return;
    }

    setIsLoading(true);

    try {
      const userId = authService.getUserId(); // Получаем ID пользователя
      if (!userId) {
        throw new Error('Пользователь не авторизован');
      }

      const formData = new FormData();
      formData.append('file', selectedFile);

      // Отправляем запрос на сервер
      const response = await fetch(`${GLOBAL_HOST}/checks/users/${userId}/process`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Ошибка при отправке файла');
      }

      const data = await response.json();

      console.log(data);
      

      // Проверяем статус обработки
      if (data.status === 'FAILED') {
        alert(`Ошибка обработки: ${data.message}`);
      } else {
        // Сохраняем ID чека для подтверждения/отмены
        setCheckId(data.checkId);
        // Устанавливаем HTML-ответ из DTO
        setServerResponse(data.checkData.data.html);
      }
    } catch (error) {
      console.error(error);
      alert(error.message || 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async (approved) => {
    if (!checkId) {
      alert('ID чека не найден');
      return;
    }

    try {

      console.log(checkId);      

      // Отправляем запрос на подтверждение/отмену
      const response = await fetch(`${GLOBAL_HOST}/checks/${checkId}/confirm?approved=${approved}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при подтверждении/отмене чека');
      }

      // Если подтверждено, переходим на главную страницу
      if (approved) {
        navigate('/main'); // Перенаправление на главную страницу
      } else {
        // Если отменено, сбрасываем состояние
        resetState();
      }
    } catch (error) {
      console.error(error);
      alert(error.message || 'Произошла ошибка');
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setServerResponse(null);
    setCheckId(null);
  };

  return (
    <div className={styles.container}>
      {/* Поле предпросмотра файла или крутящаяся иконка */}
      <div>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className={styles.spinner}></div>
            <p>Отправка файла...</p>
          </div>
        ) : serverResponse ? (
          <div
            className={styles.serverResponse}
            dangerouslySetInnerHTML={{ __html: serverResponse }}
          />
        ) : previewUrl ? (
          <div className={styles.previewContainer}>
            <p>Предпросмотр файла:</p>
            <img src={previewUrl} alt="Preview" className={styles.previewImage} />
          </div>
        ) : (
          <p>Файл не выбран</p>
        )}
      </div>

      {/* Кнопка выбора файла */}
      <label htmlFor="fileInput" className={styles.button}>
        Загрузить файл
      </label>
      <input
        type="file"
        id="fileInput"
        className={styles.hiddenInput}
        onChange={handleFileChange}
      />

      {/* Кнопка отправки файла */}
      <button
        onClick={handleFileUpload}
        disabled={!selectedFile || isLoading}
        className={styles.button}
      >
        {isLoading ? 'Отправка...' : 'Отправить файл'}
      </button>

      {/* Кнопки подтверждения/отмены */}
      {serverResponse && (
        <div className={styles.confirmButtons}>
          <button
            onClick={() => handleConfirm(true)}
            className={styles.confirmButton}
          >
            Подтвердить
          </button>
          <button
            onClick={() => handleConfirm(false)}
            className={styles.cancelButton}
          >
            Отменить
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;