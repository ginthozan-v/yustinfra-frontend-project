import axios from 'axios';

import auth from './auth';
import { getAccessToken } from '@/utils/auth';
import {
  CHANGE_PASSWORD,
  FORGOT_PASSWORD,
  FORM,
  FORM_TEMPLATE,
  GROUP,
  PROJECTS,
  RESET_PASSWORD,
  SUB_FORM,
  USERS,
  DASHBOARD,
  PROJECTS_CARDS,
  SEND_MAIL,
} from '@/constants/endpoints';
import project from './project';
import user from './user';
import form from './form';
import file from './file';
import group from './group';
import dashboard from './dashboard';
import upload from './upload';
import email from './email';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

axios.interceptors.request.use(
  function (config) {
    const accessToken = getAccessToken();

    if (
      config.url.includes(FORGOT_PASSWORD) ||
      config.url.includes(RESET_PASSWORD) ||
      config.url.includes(PROJECTS) ||
      config.url.includes(FORM) ||
      config.url.includes(SUB_FORM) ||
      config.url.includes(FORM_TEMPLATE) ||
      config.url.includes(GROUP) ||
      config.url.includes(DASHBOARD) ||
      config.url.includes(PROJECTS_CARDS) ||
      config.url.includes(SEND_MAIL) ||
      config.url.includes('/form/upload')
    ) {
      config.baseURL = API_URL;
    } else {
      config.baseURL = STRAPI_URL;
    }

    if (
      accessToken &&
      (config.url.includes(USERS) === false ||
        config.url.includes(CHANGE_PASSWORD))
    ) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  function (error) {
    console.log('🚀 error in axios interceptors', error);
    return Promise.reject(error);
  }
);

export default {
  auth: auth(axios, '/api'),
  project: project(axios, '/api'),
  user: user(axios, '/api'),
  form: form(axios, '/api'),
  file: file(axios, '/api'),
  group: group(axios, '/api'),
  dashboard: dashboard(axios, '/api'),
  upload: upload(axios, '/api'),
  email: email(axios, '/api'),
};
