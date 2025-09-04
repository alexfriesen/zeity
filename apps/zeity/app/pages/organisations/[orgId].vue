<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

definePageMeta({
    validate: async (route) => {
        // Check if the id is made up of digits
        return typeof route.params.orgId === 'string'
    }
})

const organisationId = useRoute().params.orgId as string;

const { t } = useI18n()
const { isOrganisationAdmin } = useOrganisation();

const { data, refresh } = await useFetch(() => `/api/organisation/${organisationId}`);

if (!data) {
    await navigateTo('/organisations')
}

const links = computed(() => {

    const routes: NavigationMenuItem[] = [
        { label: t('common.general'), to: `/organisations/${organisationId}`, exact: true },
    ]

    if (isOrganisationAdmin(organisationId)) {
        routes.push(
            { label: t('organisations.invites.title'), to: `/organisations/${organisationId}/invite` },
            { label: t('organisations.members.title'), to: `/organisations/${organisationId}/member` },
            { label: t('organisations.teams.title'), to: `/organisations/${organisationId}/team` },
        )
    }

    return routes
})
</script>

<template>
    <div class="relative flex flex-col min-w-0 lg:not-last:border-r lg:not-last:border-default flex-1">
        <UBreadcrumb :items="[{ label: $t('organisations.title'), to: '/organisations' }]" class="mt-4" />
        <UDashboardNavbar :title="data?.name" />

        <UDashboardToolbar>
            <UNavigationMenu :items="links" highlight class="-mx-1 flex-1" />
        </UDashboardToolbar>

        <div class="flex flex-col gap-4 sm:gap-6 flex-1 overflow-y-auto p-4 sm:p-6">
            <NuxtPage :org="data" @refresh="refresh" />
        </div>
    </div>
</template>