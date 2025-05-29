import type { User } from '@zeity/database/user';

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  function setUser(value: User | null) {
    user.value = value;
  }

  const loading = ref(false);
  function setLoading(value: boolean) {
    loading.value = value;
  }

  return {
    user,
    setUser,

    loading,
    setLoading,
  };
});
