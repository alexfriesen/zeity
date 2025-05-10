import type { User } from '@zeity/types';

export function useUser() {
  const { clear } = useUserSession();
  const userStore = useUserStore();
  const { user, loading } = storeToRefs(userStore);

  function fetchUser() {
    loading.value = true;
    return $fetch('/api/user/current', {
      retry: false,
    })
      .then(({ user }) => {
        userStore.setUser(user || null);
      })
      .catch((error) => {
        console.error('Failed to fetch user:', error);
        clear();
      })
      .finally(() => {
        loading.value = false;
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
