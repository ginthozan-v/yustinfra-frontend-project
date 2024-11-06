import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '@/api';
import { getAuthUser } from '@/utils/auth';

const UsersContext = createContext(null);

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = getAuthUser();

  const fetchUsers = async (search) => {
    setIsLoading(true);
    try {
      const response = await api.user.getAllUser(search);

      const res = response
        .filter((x) => x.id !== user.id)
        .map((res) => ({
          id: res.id,
          user: res.email,
          firstName: res.first_name || '-',
          lastName: res.last_name || '-',
          role: res.user_role.user_role_name,
          profilePicture: res.profile_picture
            ? process.env.NEXT_PUBLIC_STRAPI_API_URL + res.profile_picture.url
            : null,
        }));
      setUsers(res);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const value = useMemo(
    () => ({
      users,
      isLoading,
      fetchUsers,
    }),
    [users, isLoading]
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
};

export const useUsers = () => {
  return useContext(UsersContext);
};
