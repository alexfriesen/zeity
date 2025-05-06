export function useAuth() {
  const { loggedIn, clear } = useUserSession();

  return {
    isLoggedIn: loggedIn,
    logout: async () => {
      useOrganisation().currentOrganisationId.value = undefined;
      await clear();
      reloadNuxtApp();
    },
  };
}
