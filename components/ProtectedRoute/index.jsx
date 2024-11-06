import {
  LOGIN_ROUTE,
  FORGOT_PASSWORD_ROUTE,
  RESET_PASSWORD_ROUTE,
} from '@/constants/routes';

import { isBrowser } from '@/utils/lib';
import { isLoggedIn } from '@/utils/auth';

const ProtectedRoute = ({ router, children }) => {
  const isAuthenticated = isLoggedIn();

  let unprotectedRoutes = [
    LOGIN_ROUTE,
    FORGOT_PASSWORD_ROUTE,
    RESET_PASSWORD_ROUTE,
  ];

  let pathIsProtected = unprotectedRoutes.indexOf(router.pathname) === -1;

  if (isBrowser() && !isAuthenticated && pathIsProtected) {
    router.push(LOGIN_ROUTE);
  }

  return children;
};
export default ProtectedRoute;
