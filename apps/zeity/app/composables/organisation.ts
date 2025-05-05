export function useOrganisation() {
  const store = useOrganisationStore();
  const { currentOrganisationId } = storeToRefs(store);

  return {
    currentOrganisationId,
  };
}
