<script setup lang="ts">
import type { OrganisationMemberWithUser } from '~/types/organisation';

const model = defineModel<string[]>();

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

function toggleSelected(id: string) {
    const set = new Set(model.value || []);
    if (set.has(id)) {
        set.delete(id);
    } else {
        set.add(id);
    }
    model.value = Array.from(set);
}

function isSelected(id: string) {
    const data = model.value || [];
    return data.includes(id);
}
</script>

<template>
    <section class="flex flex-col">
        <div class="scrollable flex gap-2 pb-3">
            <USkeleton v-if="pending" class="h-8 w-16 rounded-full" />
            <USkeleton v-if="pending" class="h-8 w-16 rounded-full" />
            <UButton v-for="value of sortedMembers" :key=value.userId :label="value.user.name"
                :avatar="{ src: value.user.image || undefined, alt: value.user.name }"
                :icon="isSelected(value.userId) ? 'i-lucide-check' : undefined"
                :color="isSelected(value.userId) ? 'primary' : 'neutral'" variant="subtle" class="rounded-full max-w-60"
                @click="toggleSelected(value.userId)" />
        </div>
    </section>
</template>

<style scoped>
.scrollable {
    overflow: auto;
    scroll-behavior: smooth;
}
</style>