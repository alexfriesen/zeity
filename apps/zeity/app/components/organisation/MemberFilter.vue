<script setup lang="ts">
import type { OrganisationMemberWithUser } from '~/types/organisation';

const model = defineModel<OrganisationMemberWithUser[]>();

const { members } = defineProps({
    pending: {
        type: Boolean,
        default: false,
    },
    members: {
        type: Array as PropType<OrganisationMemberWithUser[]>,
        default: () => [],
    },
})

const { user } = useUser();

const sortedMembers = computed(() => {
    if (!members) return [];
    return members?.toSorted((member) => member.userId === user.value?.id ? -1 : 1);
});
const selectedIds = computed(() => model.value?.map(member => member.id));
const noSelected = computed(() => model.value?.length === 0);

function toggleSelected(id: number) {
    const set = new Set(selectedIds.value || []);
    if (set.has(id)) {
        set.delete(id);
    } else {
        set.add(id);
    }
    model.value = sortedMembers.value.filter(member => set.has(member.id));
}

function isSelected(id: number) {
    const data = selectedIds.value || [];
    return data.includes(id);
}
function deselectAll() {
    if (!noSelected.value) {
        model.value = [];
    }
}
</script>

<template>
    <section class="flex flex-col gap-1">
        <span class="text-sm text-muted">{{ $t('organisations.members.title') }}</span>
        <div class="scrollable flex gap-2 pb-1">
            <UButton :label="$t('common.all')" :icon="noSelected ? 'i-lucide-check' : undefined"
                :color="noSelected ? 'primary' : 'neutral'" variant="subtle" class="rounded-full max-w-60"
                @click="deselectAll()" />
            <USkeleton v-if="pending" class="h-8 w-16 rounded-full" />
            <USkeleton v-if="pending" class="h-8 w-16 rounded-full" />
            <UButton v-for="value of sortedMembers" :key=value.id :label="value.user.name"
                :avatar="{ src: getUserImagePath(value.user), alt: value.user.name }"
                :icon="isSelected(value.id) ? 'i-lucide-check' : undefined"
                :color="isSelected(value.id) ? 'primary' : 'neutral'" variant="subtle" class="rounded-full max-w-60"
                @click="toggleSelected(value.id)" />
        </div>
    </section>
</template>

<style scoped>
.scrollable {
    overflow: auto;
    scroll-behavior: smooth;
}
</style>