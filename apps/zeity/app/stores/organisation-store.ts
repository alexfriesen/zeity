import { defineStore } from 'pinia';

import { useEntityStore } from './entityStore';
import type { Organisation } from '@zeity/types/organisation';

const ORGANISATION_COOKIE_NAME = 'organisation';

export const useOrganisationStore = defineStore('organisation', () => {
  const { loggedIn } = useUserSession();

  const loading = ref(false);
  function setLoading(value: boolean) {
    loading.value = value;
  }

  // Organisations
  const organisationsStore = useEntityStore<Organisation>('organisations');

  const currentOrganisationCookie = useCookie(ORGANISATION_COOKIE_NAME, {
    sameSite: 'lax',
  });

  function setCurrentOrganisationId(id: string | null | undefined) {
    currentOrganisationCookie.value = id;
  }
  const currentOrganisationId = computed({
    get() {
      if (loggedIn.value) {
        return currentOrganisationCookie.value;
      }
      return undefined;
    },
    set(value) {
      setCurrentOrganisationId(value);
    },
  });
  const currentOrganisation = computed(() => {
    const id = currentOrganisationId.value;
    return id ? organisationsStore.findById(id).value : undefined;
  });

  function fetchOrganisations() {
    loading.value = true;
    return useRequestFetch()('/api/organisation', {
      retry: false,
    })
      .then((orgs) => {
        organisationsStore.setEntities(orgs);
        return orgs;
      })
      .catch((error) => {
        console.error('Failed to fetch user:', error);
        return [];
      })
      .finally(() => {
        loading.value = false;
      });
  }

  async function refreshOrganisations() {
    const orgs = await fetchOrganisations();

    const orgId = currentOrganisationId.value;
    if (!orgId || !orgs?.map((org) => org.id).includes(orgId)) {
      setCurrentOrganisationId(orgs[0]?.id ?? null);
    }

    return orgs;
  }

  if (import.meta.client) {
    watch(
      loggedIn,
      async (value) => {
        if (value) {
          await fetchOrganisations();
          const orgId = currentOrganisationId.value;
          if (orgId && organisationsStore.findById(orgId).value) {
            setCurrentOrganisationId(orgId);
          } else {
            setCurrentOrganisationId(
              organisationsStore.getAll().value[0]?.id ?? null
            );
          }
        } else {
          organisationsStore.clearAll();
        }
      },
      { immediate: true }
    );
  }

  return {
    currentOrganisation,
    currentOrganisationId,
    setCurrentOrganisationId,

    upsertOrganisations: organisationsStore.upsertMany,

    getAllOrganisations: organisationsStore.getAll,
    findOrganisationById: organisationsStore.findById,
    findOrganisation: organisationsStore.find,

    insertOrganisation: organisationsStore.insert,
    updateOrganisation: organisationsStore.update,
    removeOrganisation: organisationsStore.remove,

    loading,
    setLoading,

    fetchOrganisations,
    refreshOrganisations,
  };
});
