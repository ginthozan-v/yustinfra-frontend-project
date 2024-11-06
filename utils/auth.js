import { isBrowser } from './lib';

export const setAuth = (user) => {
  if (user.jwt) {
    localStorage.setItem('token', user.jwt);
  }
  localStorage.setItem('user', JSON.stringify(user.user));
};

export const getAuthUser = () => {
  if (isBrowser()) {
    let authObj = localStorage.getItem('user');
    if (authObj) {
      return JSON.parse(authObj);
    }
  }
  return false;
};

export const getAccessToken = () => {
  if (isBrowser()) {
    let token = localStorage.getItem('token');

    if (token) {
      return token;
    }
  }
  return false;
};

export const isLoggedIn = () => {
  return Boolean(getAccessToken());
};

export const logout = () => {
  localStorage.clear();
};
