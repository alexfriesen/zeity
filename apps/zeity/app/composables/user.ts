import type { User } from '@zeity/database/user';

export function useUser() {
  const { clear } = useUserSession();
  const userStore = useUserStore();
  const { user, loading } = storeToRefs(userStore);

  function fetchUser() {
    return useFetch('/api/user/current').then((result) => {
      userStore.setLoading(result.pending.value);

      if (result.status.value === 'success') {
        const user = result?.data.value?.user ?? null;
        userStore.setUser(user as User | null);
      }

      if (result.error.value?.data.statusCode === 401) {
        clear();
      }

      return result;
    });
  }

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

  function uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return $fetch('/api/user/image', {
      method: 'POST',
      body: formData,
    });
  }

  return {
    loading,
    user,
    setUser: userStore.setUser,

    fetchUser,
    updateUser,
    uploadImage,
    deleteUser,
  };
}
