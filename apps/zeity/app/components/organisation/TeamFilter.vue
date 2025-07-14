<script setup lang="ts">
import type { OrganisationMemberWithUser } from '~/types/organisation';

const { user } = useUser();
const { currentOrganisationId, fetchOrganisationTeams } = useOrganisation();
const { pending: teamsPending, data: teams } = await fetchOrganisationTeams(currentOrganisationId!);
const { pending: membersPending, data: members } = await useLazyAsyncData(`organisation-${currentOrganisationId.value}-member`, () =>
    $fetch(`/api/organisation/${currentOrganisationId.value}/member`, {
        method: 'GET',
        query: {
            team: selectedIds.value,
        },
    }),
    {
        watch: [selectedIds],
    }
);

const model = defineModel<OrganisationMemberWithUser[]>();
const selectedIds = ref<number[]>([]);
const noSelected = computed(() => selectedIds.value.length === 0);

const sortedMembers = computed(() => {
    const data = members.value || [];
    if (!data) return [];
    return data.toSorted((member) => member.userId === user.value?.id ? -1 : 1);
});

function toggleSelected(id: number) {
    const set = new Set(selectedIds.value || []);
    if (set.has(id)) {
        set.delete(id);
    } else {
        set.add(id);
    }
    selectedIds.value = Array.from(set);
}

function isSelected(id: number) {
    const data = selectedIds.value || [];
    return data.includes(id);
}

function deselectAll() {
    if (!noSelected.value) {
        selectedIds.value = [];
    }
}
</script>

<template>
    <section class="flex flex-col gap-1">
        <span class="text-sm text-muted">{{ $t('organisations.teams.title') }}</span>
        <div class="scrollable flex gap-2 pb-1">
            <UButton :label="$t('common.all')" :icon="noSelected ? 'i-lucide-check' : undefined"
                :color="noSelected ? 'primary' : 'neutral'" variant="subtle" class="rounded-full max-w-60"
                @click="deselectAll()" />
            <USkeleton v-if="teamsPending" class="h-8 w-16 rounded-full" />
            <USkeleton v-if="teamsPending" class="h-8 w-16 rounded-full" />
            <UButton v-for="team of teams" :key=team.id :label="team.name"
                :icon="isSelected(team.id) ? 'i-lucide-check' : undefined"
                :color="isSelected(team.id) ? 'primary' : 'neutral'" variant="subtle" class="rounded-full max-w-60"
                @click="toggleSelected(team.id)" />
        </div>
    </section>

    <OrganisationMemberFilter v-model="model" :members="sortedMembers" :pending="membersPending" />
</template>

<style scoped>
.scrollable {
    overflow: auto;
    scroll-behavior: smooth;
}
</style>