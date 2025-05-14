<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui';

const { t } = useI18n();
const { logout } = useAuth();
const { user } = useUser();

const { currentOrganisationId, setCurrentOrganisationId, getAllOrganisations } = useOrganisation();
const organisations = getAllOrganisations();

const userMenu = computed(() => [
    [

        {
            label: t('navigation.profile'),
            icon: 'i-lucide-user',
            to: '/user',
            slot: 'profile',
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
                src: organisation.image || undefined,
                alt: organisation.name,
            },
            slot: currentOrganisationId.value === organisation.id ? 'selectedOrg' as const : undefined,
            onSelect: () => setCurrentOrganisationId(organisation.id),
        })),
    ],
    [
        {
            label: t('auth.logout'),
            icon: 'i-lucide-arrow-left-from-line',
            onSelect: () => logout(),
        },
    ],
] satisfies DropdownMenuItem[]);
</script>

<template>
    <UDropdownMenu :items="userMenu" size="xl">
        <UAvatar :src="user?.image || undefined" :alt="user?.name" as="button"
            class="ring ring-inset ring-primary/50 hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-primary/10" />
        <template #profile>
            <UAvatar :src="user?.image || undefined" :alt="user?.name" size="xl" />
            <div class="flex flex-col">
                <h3 class="text-base font-semibold">
                    {{ user?.name }}
                </h3>
                <p class="text-xs text-muted">
                    {{ user?.email }}
                </p>
            </div>
        </template>
        <template #selectedOrg-trailing>
            <UIcon name="i-lucide-circle-check" class="shrink-0 size-5 text-primary" />
        </template>
    </UDropdownMenu>
</template>