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

  return {
    currentOrganisation,
    currentOrganisationId,
    setCurrentOrganisationId,
    setOrganisations: organisationsStore.setEntities,

    upsertOrganisations: organisationsStore.upsertMany,

    getAllOrganisations: organisationsStore.getAll,
    findOrganisationById: organisationsStore.findById,
    findOrganisation: organisationsStore.find,

    insertOrganisation: organisationsStore.insert,
    updateOrganisation: organisationsStore.update,
    removeOrganisation: organisationsStore.remove,

    clearAllOrganisations: organisationsStore.clearAll,

    loading,
    setLoading,
  };
});
