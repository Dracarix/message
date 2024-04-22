import { useState, useEffect } from 'react';

const useHandlerErr = (errorCode: string | null) => {
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (errorCode) {
        const handleFirebaseError = (errorCode: string) => {
            switch (errorCode) {
                case 'auth/claims-too-large':
                    setErrorMessage('Полезная нагрузка утверждений, передаваемая в setCustomUserClaims() превышает максимально допустимый размер в 1000 байт.');
                    break;
                case 'auth/email-already-exists':
                    setErrorMessage('Указанный адрес электронной почты уже используется существующим пользователем. Каждый пользователь должен иметь уникальный адрес электронной почты.');
                    break;
                case 'auth/id-token-expired':
                    setErrorMessage('Срок действия предоставленного токена Firebase ID истек.');
                    break;
                case 'auth/id-token-revoked':
                    setErrorMessage('Токен Firebase ID отозван.');
                    break;
                case 'auth/insufficient-permission':
                    setErrorMessage('Учетные данные, используемые для инициализации Admin SDK, не имеют достаточных разрешений для доступа к запрошенному ресурсу аутентификации. См. раздел Настройка проекта Firebase для получения документации о том, как создать учетные данные с соответствующими разрешениями и использовать их для аутентификации Admin SDK.');
                    break;
                case 'auth/internal-error':
                    setErrorMessage('Сервер аутентификации обнаружил непредвиденную ошибку при попытке обработать запрос. Сообщение об ошибке должно содержать ответ сервера аутентификации, содержащий дополнительную информацию. Если ошибка не устранена, сообщите о проблеме в наш канал поддержки отчетов об ошибках.');
                    break;
                case 'auth/invalid-argument':
                    setErrorMessage('Методу аутентификации предоставлен недопустимый аргумент. Сообщение об ошибке должно содержать дополнительную информацию.');
                    break;
                case 'auth/invalid-claims':
                    setErrorMessage('Пользовательские атрибуты утверждения, предоставленные для setCustomUserClaims() недействительны.');
                    break;
                case 'auth/invalid-continue-uri':
                    setErrorMessage('URL-адрес продолжения должен быть допустимой строкой URL-адреса.');
                    break;
                case 'auth/invalid-creation-time':
                    setErrorMessage('Время создания должно быть допустимой строкой даты в формате UTC.');
                    break;
                case 'auth/invalid-credential':
                    setErrorMessage('Что то пошло не так ,попробуйте еще раз , возможно что не правильный email или пароль. ');
                    break;
                case 'auth/invalid-disabled-field':
                    setErrorMessage('Указанное значение свойства disabled пользователя недопустимо. Это должно быть логическое значение.');
                    break;
                case 'auth/invalid-display-name':
                    setErrorMessage('Указанное значение пользовательского свойства displayName недопустимо. Это должна быть непустая строка.');
                    break;
                case 'auth/invalid-dynamic-link-domain':
                    setErrorMessage('Предоставленный домен динамических ссылок не настроен и не авторизован для текущего проекта.');
                    break;
                case 'auth/invalid-email':
                    setErrorMessage('Указанное значение свойства пользователя email недопустимо. Это должен быть строковый адрес электронной почты.');
                    break;
                case 'auth/invalid-email-verified':
                    setErrorMessage('Указанное значение свойства пользователя emailVerified недопустимо. Это должно быть логическое значение.');
                    break;
                case 'auth/invalid-hash-algorithm':
                    setErrorMessage('Алгоритм хеширования должен соответствовать одной из строк в списке поддерживаемых алгоритмов.');
                    break;
                case 'auth/invalid-hash-block-size':
                    setErrorMessage('Размер хеш-блока должен быть допустимым числом.');
                    break;
                case 'auth/invalid-hash-derived-key-length':
                    setErrorMessage('Длина ключа, полученного из хеша, должна быть допустимым числом.');
                    break;
                case 'auth/invalid-hash-key':
                    setErrorMessage('Хэш-ключ должен иметь действительный байтовый буфер.');
                    break;
                case 'auth/invalid-hash-memory-cost':
                    setErrorMessage('Стоимость хэш-памяти должна быть допустимым числом.');
                    break;
                case 'auth/invalid-hash-parallelization':
                    setErrorMessage('Распараллеливание хеша должно быть допустимым числом.');
                    break;
                case 'auth/invalid-hash-rounds':
                    setErrorMessage('Число хэш-раундов должно быть допустимым.');
                    break;
                case 'auth/invalid-hash-salt-separator':
                    setErrorMessage('Поле разделителя соли алгоритма хеширования должно быть допустимым буфером байтов.');
                    break;
                case 'auth/invalid-id-token':
                    setErrorMessage('Предоставленный токен идентификатора не является действительным токеном идентификатора Firebase.');
                    break;
                case 'auth/invalid-last-sign-in-time':
                    setErrorMessage('Время последнего входа должно быть допустимой строкой даты в формате UTC.');
                    break;
                case 'auth/invalid-page-token':
                    setErrorMessage('Предоставленный токен следующей страницы в listUsers() недействителен. Это должна быть действительная непустая строка.');
                    break;
                case 'auth/invalid-password':
                    setErrorMessage('Указанное значение свойства пользователя password недопустимо. Это должна быть строка, содержащая не менее шести символов.');
                    break;
                case 'auth/invalid-password-hash':
                    setErrorMessage('Хэш пароля должен представлять собой действительный буфер байтов.');
                    break;
                case 'auth/invalid-password-salt':
                    setErrorMessage('Соль пароля должна быть допустимым байтовым буфером.');
                    break;
                case 'auth/invalid-phone-number':
                    setErrorMessage('Предоставленное значение для phoneNumber недействительно. Это должна быть непустая строка идентификатора, совместимая со стандартом E.164.');
                    break;
                case 'auth/invalid-photo-url':
                    setErrorMessage('Указанное значение пользовательского свойства photoURL недействительно. Это должен быть строковый URL-адрес.');
                    break;
                case 'auth/invalid-provider-data':
                    setErrorMessage('ПоставщикДанные должен быть допустимым массивом объектов UserInfo.');
                    break;
                case 'auth/invalid-provider-id':
                    setErrorMessage('ProviderId должен быть допустимой строкой идентификатора поддерживаемого поставщика.');
                    break;
                case 'auth/invalid-oauth-responsetype':
                    setErrorMessage('Только для одного responseType OAuth должно быть установлено значение true.');
                    break;
                case 'auth/invalid-session-cookie-duration':
                    setErrorMessage('Продолжительность сеансового файла cookie должна быть допустимым числом в миллисекундах от 5 минут до 2 недель.');
                    break;
                case 'auth/invalid-uid':
                    setErrorMessage('Предоставленный uid должен представлять собой непустую строку длиной не более 128 символов.');
                    break;
                case 'auth/invalid-user-import':
                    setErrorMessage('Запись пользователя для импорта недействительна.');
                    break;
                case 'auth/maximum-user-count-exceeded':
                    setErrorMessage('Превышено максимально допустимое количество пользователей для импорта.');
                    break;
                case 'auth/missing-android-pkg-name':
                    setErrorMessage('Если необходимо установить приложение Android, необходимо указать имя пакета Android.');
                    break;
                case 'auth/missing-continue-uri':
                    setErrorMessage('В запросе должен быть указан действительный URL-адрес продолжения.');
                    break;
                case 'auth/missing-hash-algorithm':
                    setErrorMessage('Импорт пользователей с хэшами паролей требует предоставления алгоритма хеширования и его параметров.');
                    break;
                case 'auth/missing-ios-bundle-id':
                    setErrorMessage('В запросе отсутствует идентификатор пакета.');
                    break;
                case 'auth/missing-uid':
                    setErrorMessage('Для текущей операции требуется идентификатор uid.');
                    break;
                case 'auth/missing-oauth-client-secret':
                    setErrorMessage('Секрет клиента конфигурации OAuth необходим для включения потока кода OIDC.');
                    break;
                case 'auth/operation-not-allowed':
                    setErrorMessage('Предоставленный поставщик услуг входа отключен для вашего проекта Firebase. Включите его в разделе "Метод входа" консоли Firebase.');
                    break;
                case 'auth/phone-number-already-exists':
                    setErrorMessage('Указанный phoneNumber уже используется существующим пользователем. Каждый пользователь должен иметь уникальный phoneNumber.');
                    break;
                case 'auth/project-not-found':
                    setErrorMessage('Не найден проект Firebase для учетных данных, используемых для инициализации Admin SDK.');
                    break;
                case 'auth/reserved-claims':
                    setErrorMessage('Одно или несколько пользовательских утверждений, предоставленных setCustomUserClaims() зарезервированы.');
                    break;
                case 'auth/session-cookie-expired':
                    setErrorMessage('Срок действия предоставленного файла cookie сеанса Firebase истек.');
                    break;
                case 'auth/session-cookie-revoked':
                    setErrorMessage('Файл cookie сеанса Firebase был отозван.');
                    break;
                case 'auth/too-many-requests':
                    setErrorMessage('Количество запросов превышает максимально допустимое.');
                    break;
                case 'auth/uid-already-exists':
                    setErrorMessage('Предоставленный uid уже используется существующим пользователем. Каждый пользователь должен иметь уникальный uid.');
                    break;
                case 'auth/unauthorized-continue-uri':
                    setErrorMessage('Домен URL-адреса продолжения не внесен в белый список. Добавьте домен в белый список в консоли Firebase.');
                    break;
                case 'auth/user-not-found':
                    setErrorMessage('Пользователь не найден.');
                    break;
                default:
                    setErrorMessage('Что-то пошло не так.');
                    break;
            }
        };

    
      handleFirebaseError(errorCode);
    }
  }, [errorCode]);

  return errorMessage;
};

export default useHandlerErr;
