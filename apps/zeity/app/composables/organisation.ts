import type { NewOrganisation, Organisation } from '@zeity/types/organisation';

export function useOrganisation() {
  const store = useOrganisationStore();
  const { currentOrganisation, currentOrganisationId } = storeToRefs(store);

  function fetchOrganisations() {
    return useFetch('/api/organisation').then((result) => {
      store.setLoading(result.pending.value);

      if (result.status.value === 'success') {
        const orgs = result.data.value || [];
        store.setOrganisations(orgs);
      }

      return result;
    });
  }

  function fetchOrganisation(orgId: MaybeRef<string | null | undefined>) {
    const id = toRef(orgId);
    return useFetch(() => `/api/organisation/${id.value}`);
  }

  function fetchOrganisationMembers(
    orgId: MaybeRef<string | null | undefined>
  ) {
    const id = toRef(orgId);
    return useFetch(() => `/api/organisation/${id.value}/member`, {
      lazy: true,
      watch: [id],
      default: () => [],
    });
  }

  async function refreshOrganisations() {
    const { data } = await fetchOrganisations();
    const orgs = data.value || [];

    const orgId = currentOrganisationId.value;
    if (!orgId || !orgs.map((org) => org.id).includes(orgId)) {
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
