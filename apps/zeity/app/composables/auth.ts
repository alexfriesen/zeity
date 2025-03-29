export function useAuth() {
  const { loggedIn, clear } = useUserSession();

  return {
    isLoggedIn: loggedIn,
    logout: async () => {
      await clear();
      reloadNuxtApp();
    },
  };
}
