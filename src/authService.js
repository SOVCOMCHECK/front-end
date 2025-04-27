import Keycloak from 'keycloak-js';
import { jwtDecode } from 'jwt-decode';

const KEYCLOAK_HOST = 'http://localhost:8282'
// 'https://158.160.109.57:8443';
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
  return data ? data.sub : null;
};

const getUserRoles = () => {
  const data = getTokenData();
  return data?.realm_access?.roles || [];
};

const isAuthenticated = () => kc.authenticated;

export default {
  kc,
  getUserName,
  getUserId,
  getUserRoles,
  getTokenData,
  isAuthenticated,
};
