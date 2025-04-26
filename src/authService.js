import Keycloak from 'keycloak-js';
import {jwtDecode} from 'jwt-decode';

const KEYCLOAK_HOST = 'http://localhost:8282/';
const SOVCOMCHECK = 'sovcomcheck';

let initOptions = {
  url: KEYCLOAK_HOST,
  realm: SOVCOMCHECK,
  clientId: SOVCOMCHECK,
};

let kc = new Keycloak(initOptions);

const getTokenData = () => {
  if (kc.token) {
    return jwtDecode(kc.token);
  }
  return null;
};

const getUserName = () => {
  const data = getTokenData();
  return data ? data.preferred_username : null;
};

const getUserId = () => {
    const data = getTokenData();
    return data ? data.sub : null; // Поле sub содержит ID пользователя
  };


const isAuthenticated = () => kc.authenticated;

export default {
  kc,
  getUserName,
  getUserId,
  isAuthenticated,
};