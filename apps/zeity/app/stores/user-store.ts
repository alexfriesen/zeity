import type { User } from '@zeity/types/user';

export const useUserStore = defineStore('user', () => {
  const { loggedIn, clear } = useUserSession();

  const user = ref<User | null>(null);
  function setUser(value: User | null) {
    user.value = value;
  }

  const loading = ref(false);
  function setLoading(value: boolean) {
    loading.value = value;
  }

  function fetchUser() {
    loading.value = true;
    return useRequestFetch()('/api/user/current', {
      retry: false,
    })
      .then(({ user }) => {
        setUser(user || null);
      })
      .catch((error) => {
        console.error('Failed to fetch user:', error);
        clear();
      })
      .finally(() => {
        loading.value = false;
      });
  }

  if (import.meta.client) {
    watch(
      loggedIn,
      async (value) => {
        if (value) {
          await fetchUser();
        } else {
          setUser(null);
        }
      },
      { immediate: true }
    );
  }

  return {
    user,
    setUser,

    loading,
    setLoading,

    fetchUser,
  };
});
