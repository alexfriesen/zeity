import type { NewOrganisation, Organisation } from '@zeity/types/organisation';

export function useOrganisation() {
  const store = useOrganisationStore();
  const { currentOrganisationId } = storeToRefs(store);

  function fetchOrganisations() {
    store.setLoading(true);
    return useRequestFetch()('/api/organisation', {
      retry: false,
    })
      .then((orgs) => {
        store.setOrganisations(orgs);
        return orgs;
      })
      .catch((error) => {
        console.error('Failed to fetch user:', error);
        return [];
      })
      .finally(() => {
        store.setLoading(false);
      });
  }

  async function refreshOrganisations() {
    const orgs = await fetchOrganisations();

    const orgId = currentOrganisationId.value;
    if (!orgId || !orgs?.map((org) => org.id).includes(orgId)) {
      store.setCurrentOrganisationId(orgs[0]?.id ?? null);
    }

    return orgs;
  }

  async function createOrganisation(data: Organisation | NewOrganisation) {
    store.setLoading(true);
    return $fetch('/api/organisation', {
      method: 'POST',
      body: data,
    })
      .then((data) => {
        if (data?.id) {
          store.insertOrganisation(data);
        }
        return data;
      })
      .finally(() => {
        store.setLoading(false);
      });
  }

  function getAllOrganisations() {
    return store.getAllOrganisations();
  }

  return {
    currentOrganisationId,
    setCurrentOrganisationId: store.setCurrentOrganisationId,

    fetchOrganisations,
    refreshOrganisations,

    createOrganisation,

    getAllOrganisations,
    findOrganisationById: store.findOrganisationById,
  };
}
