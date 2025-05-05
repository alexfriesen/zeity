<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui';

const { t } = useI18n();
const { logout } = useAuth();
const { user } = useUserSession();

const store = useOrganisationStore();
const { currentOrganisationId } = storeToRefs(store);
const organisations = store.getAllOrganisations();

const userMenu = computed(() => [
    [

        {
            label: t('navigation.profile'),
            icon: 'i-lucide-user',
            to: '/user',
        },
        {
            label: t('auth.logout'),
            icon: 'i-lucide-arrow-left-from-line',
            onSelect: () => logout(),
        },
    ], [
        {
            label: t('organisations.title'),
            to: '/organisations',
            icon: 'i-lucide-store',
        },
        ...organisations.value.map((organisation) => ({
            label: organisation.name,
            avatar: {
                alt: organisation.name,
            },
            slot: currentOrganisationId.value === organisation.id ? 'selectedOrg' as const : undefined,
            onSelect: () => store.setCurrentOrganisationId(organisation.id),
        })),
        {
            label: t('organisations.create'),
            to: '/organisations/create',
            icon: 'i-lucide-plus',
        },
    ],
] satisfies DropdownMenuItem[]);
</script>

<template>
    <UDropdownMenu :items="userMenu" size="xl">
        <UAvatar :alt="user?.name" as="button"
            class="ring ring-inset ring-primary/50 hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-primary/10" />
        <template #selectedOrg-trailing>
            <UIcon name="i-lucide-circle-check" class="shrink-0 size-5 text-primary" />
        </template>
    </UDropdownMenu>
</template>