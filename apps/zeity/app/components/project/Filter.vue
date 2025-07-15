<script setup lang="ts">
import type { Project } from '@zeity/types/project';
import { PROJECT_STATUS_ACTIVE } from '@zeity/types/project';

const model = defineModel<string[]>();

const { getOrganisationProjects } = useProject();

const projects = getOrganisationProjects();
const activeProjects = computed(() => projects.value.filter((project) => project.status === PROJECT_STATUS_ACTIVE));
const noSelected = computed(() => model.value?.length === 0);

function toggleSelected(item: Project) {
    const set = new Set(model.value || []);
    if (set.has(item.id)) {
        set.delete(item.id);
    } else {
        set.add(item.id);
    }
    model.value = Array.from(set);
}

function isSelected(item: Project) {
    const data = model.value || [];
    return data.includes(item.id);
}

function deselectAll() {
    if (!noSelected.value) {
        model.value = [];
    }
}
</script>

<template>
    <section class="flex flex-col gap-1">
        <span class="text-sm text-muted">{{ $t('projects.title') }}</span>
        <div class="scrollable flex gap-2 pb-1">
            <UButton :label="$t('common.all')" :icon="noSelected ? 'i-lucide-check' : undefined"
                :color="noSelected ? 'primary' : 'neutral'" variant="subtle" class="rounded-full max-w-60"
                @click="deselectAll()" />
            <UButton v-for="value of activeProjects" :key=value.id :label="value.name"
                :icon="isSelected(value) ? 'i-lucide-check' : undefined"
                :color="isSelected(value) ? 'primary' : 'neutral'" variant="subtle" class="rounded-full max-w-60"
                @click="toggleSelected(value)" />
        </div>
    </section>
</template>

<style scoped>
.scrollable {
    overflow: auto;
    scroll-behavior: smooth;
}
</style>