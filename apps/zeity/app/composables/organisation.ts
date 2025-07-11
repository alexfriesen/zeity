import type { NewOrganisationTeam } from '@zeity/database/organisation-team';
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

  function fetchOrganisationTeams(orgId: MaybeRef<string | null | undefined>) {
    const orgIdRef = toRef(orgId);
    return useFetch(() => `/api/organisation/${orgIdRef.value}/team`);
  }

  function fetchOrganisationTeam(
    orgId: MaybeRef<string | null | undefined>,
    teamId: MaybeRef<number | null | undefined>
  ) {
    const orgIdRef = toRef(orgId);
    const teamIdRef = toRef(teamId);
    return useFetch(
      () => `/api/organisation/${orgIdRef.value}/team/${teamIdRef.value}`
    );
  }

  async function createOrganisationTeam(
    orgId: string,
    data: NewOrganisationTeam
  ) {
    store.setLoading(true);
    return (
      $fetch(`/api/organisation/${orgId}/team`, {
        method: 'POST',
        body: data,
      })
        // TODO: add org team to store
        // .then((data) => {
        //   if (data?.id) {
        //     store.insertOrganisation(data);
        //   }
        //   return data;
        // })
        .finally(() => {
          store.setLoading(false);
        })
    );
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
    loading: store.loading,
    currentOrganisation,
    currentOrganisationId,
    setCurrentOrganisationId: store.setCurrentOrganisationId,

    fetchOrganisation,
    fetchOrganisations,
    refreshOrganisations,
    fetchOrganisationMembers,

    createOrganisation,
    uploadOrganisationImage,

    fetchOrganisationTeams,
    fetchOrganisationTeam,
    createOrganisationTeam,

    getAllOrganisations,
    findOrganisationById: store.findOrganisationById,
  };
}
