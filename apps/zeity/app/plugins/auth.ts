export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.hooks.hook('app:mounted', async () => {
    const { loggedIn } = useUserSession();
    const { fetchUser, setUser } = useUser();
    const organisationsStore = useOrganisationStore();
    const {
      currentOrganisationId,
      setCurrentOrganisationId,
      fetchOrganisations,
      getAllOrganisations,
      findOrganisationById,
    } = useOrganisation();

    watch(
      loggedIn,
      async (value) => {
        if (value) {
          await fetchUser();
          await fetchOrganisations();
          const orgId = currentOrganisationId.value;
          if (orgId && findOrganisationById(orgId).value) {
            setCurrentOrganisationId(orgId);
          } else {
            setCurrentOrganisationId(
              getAllOrganisations().value[0]?.id ?? null
            );
          }
        } else {
          organisationsStore.clearAllOrganisations();
          setUser(null);
        }
      },
      { immediate: true }
    );
  });
});
