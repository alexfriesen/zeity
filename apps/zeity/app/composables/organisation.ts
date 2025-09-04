import {
  ORGANISATION_MEMBER_ROLE_ADMIN,
  ORGANISATION_MEMBER_ROLE_OWNER,
} from '@zeity/types/organisation';

export function useOrganisation() {
  const store = useOrganisationStore();
  const { currentOrganisation, currentOrganisationId } = storeToRefs(store);

  function getOrganisationRole(orgId: string) {
    return computed(() => {
      const org = store.findOrganisationById(orgId);
      return org.value?.role ?? null;
    });
  }

  function isOrganisationAdmin(orgId: string) {
    const role = getOrganisationRole(orgId);
    return [
      ORGANISATION_MEMBER_ROLE_OWNER,
      ORGANISATION_MEMBER_ROLE_ADMIN,
    ].includes(role.value ?? '');
  }

  function fetchOrganisations() {
    console.log('fetchOrganisations');
    return $fetch('/api/organisation', { cache: 'reload' })
      .then((result) => {
        const orgs = result || [];
        store.setOrganisations(orgs);

        return result;
      })
      .catch((error) => {
        console.error('Error fetching organisations:', error);
        return [];
      });
  }

  async function refreshOrganisations() {
    const data = await fetchOrganisations();
    const orgs = data || [];

    const orgId = currentOrganisationId.value;
    if (!orgId || !orgs.map((org) => org.id).includes(orgId)) {
      store.setCurrentOrganisationId(orgs[0]?.id ?? null);
    }

    return orgs;
  }

  function uploadOrganisationImage(id: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return $fetch(`/api/organisation/${id}/image`, {
      method: 'POST',
      body: formData,
    });
  }

  return {
    loading: store.loading,
    currentOrganisation,
    currentOrganisationId,
    getOrganisationRole,
    isOrganisationAdmin,
    setCurrentOrganisationId: store.setCurrentOrganisationId,

    fetchOrganisations,
    refreshOrganisations,

    uploadOrganisationImage,

    getAllOrganisations: store.getAllOrganisations,
    findOrganisationById: store.findOrganisationById,
  };
}
