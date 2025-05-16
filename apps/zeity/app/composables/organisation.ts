import type { NewOrganisation, Organisation } from '@zeity/types/organisation';

export function useOrganisation() {
  const store = useOrganisationStore();
  const { currentOrganisation, currentOrganisationId } = storeToRefs(store);

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

  function fetchOrganisation(id: string) {
    return $fetch(`/api/organisation/${id}`);
  }

  function fetchOrganisationMembers(orgId: string) {
    return $fetch(`/api/organisation/${orgId}/member`);
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

  function uploadOrganisationImage(id: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return $fetch(`/api/organisation/${id}/image`, {
      method: 'POST',
      body: formData,
    });
  }

  function getAllOrganisations() {
    return store.getAllOrganisations();
  }

  return {
    currentOrganisation,
    currentOrganisationId,
    setCurrentOrganisationId: store.setCurrentOrganisationId,

    fetchOrganisation,
    fetchOrganisations,
    refreshOrganisations,
    fetchOrganisationMembers,

    createOrganisation,
    uploadOrganisationImage,

    getAllOrganisations,
    findOrganisationById: store.findOrganisationById,
  };
}
