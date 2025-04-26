import React, { useState } from 'react';
import styles from './FileUploadComponent.module.css';

const FileUploadComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [serverResponse, setServerResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

    setTimeout(() => {
      const mockHtmlResponse = `
        <table class="b-check_table table">
          <tbody>
            <tr class="b-check_center"><td colspan="5">АКЦИОНЕРНОЕ ОБЩЕСТВО "ТАНДЕР"</td></tr>
            <tr class="b-check_center"><td colspan="5">410049, Саратовская обл, Саратов г, Энтузиастов пр-кт, дом № 29, помещение 2</td></tr>
            <tr class="b-check_center"><td colspan="5">ИНН 2310031475</td></tr>
            <tr class="b-check_center"><td colspan="5">&nbsp;</td></tr>
            <tr class="b-check_center"><td colspan="5">24.04.2025 17:43</td></tr>
            <tr class="b-check_center"><td colspan="5">Чек № 67</td></tr>
            <tr class="b-check_center"><td colspan="5">Смена № 123</td></tr>
            <tr class="b-check_center"><td colspan="5">Кассир</td></tr>
            <tr class="b-check_center"><td colspan="5">Приход</td></tr>
            <tr><td><strong>№</strong></td><td><strong>Название</strong></td><td><strong>Цена</strong></td><td><strong>Кол.</strong></td><td><strong>Сумма</strong></td></tr>
            <tr><td>1</td><td>МАГНИТ Пакет-майка большой 15кг</td><td>9.99</td><td>1</td><td>9.99</td></tr>
            <tr><td>2</td><td>RICHARD Royal Ceylon Чай черный 100пак 200г к</td><td>289.99</td><td>1</td><td>289.99</td></tr>
            <tr><td>3</td><td>GREEN MILK Нап Фермен яч/нут кокос1л т/п</td><td>114.99</td><td>1</td><td>114.99</td></tr>
            <tr><td>4</td><td>MAKFA Макароны петуш. гребешки в/с 450г :10</td><td>67.99</td><td>1</td><td>67.99</td></tr>
            <tr><td>5</td><td>SEN SOY Соус соевый классический 1л п/бут(Рос</td><td>149.99</td><td>1</td><td>149.99</td></tr>
            <tr><td>6</td><td>КУХМАСТЕР Kremareo Печенье Лесной орех 100г:1</td><td>34.99</td><td>1</td><td>34.99</td></tr>
            <tr><td>7</td><td>ВОСТОЧНЫЙ ГОСТЬ Кунжут 20г сашет:20</td><td>29.99</td><td>1</td><td>29.99</td></tr>
            <tr><td>8</td><td>HEINZ Соус Сладкий чили 200г д/п (Петропродук</td><td>119.99</td><td>1</td><td>119.99</td></tr>
            <tr><td>9</td><td>Лаваш Ливанский 300г п/уп(Знак хлеба)</td><td>47.99</td><td>1</td><td>47.99</td></tr>
            <tr><td>10</td><td>БАНАНЫ 1кг</td><td>179.99</td><td>0.694</td><td>124.91</td></tr>
            <tr><td colspan="3" class="b-check_itogo">ИТОГО:</td><td></td><td class="b-check_itogo">990.82</td></tr>
            <tr><td colspan="3">Наличные</td><td></td><td>0.00</td></tr>
            <tr><td colspan="3">Карта</td><td></td><td>990.82</td></tr>
            <tr><td colspan="3">НДС итога чека со ставкой 20%</td><td></td><td>121.65</td></tr>
            <tr><td colspan="3">НДС итога чека со ставкой 10%</td><td></td><td>23.72</td></tr>
            <tr><td colspan="5" class="b-check_center">ВИД НАЛОГООБЛОЖЕНИЯ: ОСН</td></tr>
            <tr><td colspan="5">РЕГ.НОМЕР ККТ: 0008618227013847    </td></tr>
            <tr><td colspan="5">ЗАВОД. №: </td></tr>
            <tr><td colspan="5">ФН: 7380440700556581</td></tr>
            <tr><td colspan="5">ФД: 10244</td></tr>
            <tr><td colspan="5">ФПД#: 3866612080</td></tr>
            <tr><td colspan="5" class="b-check_center"><img src="/qrcode/generate?text=t%3D20250424T1743%26s%3D990.82%26fn%3D7380440700556581%26i%3D10244%26fp%3D3866612080%26n%3D1" alt="QR код чека" width="35%" loading="lazy" decoding="async"></td></tr>
          </tbody>
        </table>
      `;
      setServerResponse(mockHtmlResponse);
      setIsLoading(false);
    }, 2000);
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
    </div>
  );
};

export default FileUploadComponent;