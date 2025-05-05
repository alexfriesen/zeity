import type { User } from '@zeity/types';

export function useUser() {
  const userStore = useUserStore();
  const { user, loading } = storeToRefs(userStore);

  async function deleteUser() {
    return $fetch('/api/user/current', {
      method: 'delete',
    }).then(async () => {
      await useUserSession().clear();
    });
  }

  function updateUser(data: Partial<User>) {
    return $fetch('/api/user/current', {
      method: 'PATCH',
      body: data,
    }).then(async (data) => {
      await useUserSession().fetch();
      return data;
    });
  }

  return {
    user,
    loading,

    deleteUser,
    updateUser,
  };
}
