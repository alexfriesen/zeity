export default defineNuxtPlugin(async () => {
  const { loggedIn } = useUserSession();
  const { fetchUser, reset } = useUser();
  const {
    currentOrganisationId,
    setCurrentOrganisationId,
    getAllOrganisations,
    findOrganisationById,
  } = useOrganisation();

  watch(
    loggedIn,
    async (value) => {
      if (value) {
        await fetchUser();
        const orgId = currentOrganisationId.value;
        if (orgId && findOrganisationById(orgId).value) {
          setCurrentOrganisationId(orgId);
        } else {
          setCurrentOrganisationId(getAllOrganisations().value[0]?.id ?? null);
        }
      } else {
        reset();
      }
    },
    { immediate: true }
  );
});
