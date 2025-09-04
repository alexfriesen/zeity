<script setup lang="ts">
const { currentOrganisationId, setCurrentOrganisationId } = useOrganisation();

const { data, pending } = await useFetch('/api/organisation', { cache: 'reload' });
const isEmpty = computed(() => {
    if (pending.value) {
        return false;
    }
    return (data.value?.length ?? 0) < 1
});
</script>

<template>
    <div>
        <UDashboardNavbar :title="$t('organisations.title')">
            <template #right>
                <UButton to="/organisations/create" icon="i-lucide-plus">{{ $t('common.add') }}</UButton>
            </template>
        </UDashboardNavbar>

        <section class="flex flex-col my-3 space-y-4">
            <UCard v-for="organisation in data" :key="organisation.id">
                <template #header>
                    <div class="flex items-center justify-between gap-4 flex-shrink">
                        <UButton :to="`/organisations/${encodeURIComponent(organisation.id)}`" variant="link" size="lg"
                            class="flex items-center justify-between -mx-3 truncate">
                            <UAvatar :src="getOrganisationImagePath(organisation)" :alt="organisation.name" size="lg"
                                class="mr-2" />

                            <div class="truncate">
                                <span class="text-lg">
                                    {{ organisation.name }}
                                </span>
                                <p class="text-xs text-dimmed">
                                    {{ $t('organisations.members.count', organisation.stats.members ?? 0) }}
                                </p>
                                <p class="text-xs text-dimmed">
                                    {{ $t('organisations.teams.count', organisation.stats.teams ?? 0) }}
                                </p>
                            </div>
                        </UButton>

                        <UButton variant="ghost" size="lg" square class="rounded-full"
                            :color="currentOrganisationId === organisation.id ? 'primary' : 'neutral'"
                            :icon="currentOrganisationId === organisation.id ? 'i-lucide-circle-check' : 'i-lucide-circle'"
                            @click="setCurrentOrganisationId(organisation.id)" />
                    </div>
                </template>
            </UCard>

            <UAlert v-if="isEmpty" variant="subtle" title="Hey there!"
                description="It looks like you don't have any organisation yet. Why not create one?"
                icon="i-lucide-info" :ui="{ icon: 'size-20' }" :actions="[
                    { label: $t('common.add'), icon: 'i-lucide-plus', to: '/organisations/create' }
                ]" />
        </section>
    </div>
</template>
