<script setup lang="ts">
import { PROJECT_STATUS_ACTIVE, type Project } from '@zeity/types/project';

const model = defineModel<string[]>();

const { getOrganisationProjects } = useProject();

const projects = getOrganisationProjects();
const activeProjects = computed(() => projects.value.filter((project) => project.status === PROJECT_STATUS_ACTIVE));

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
</script>

<template>
    <section class="flex flex-col">
        <div class="scrollable flex gap-2 pb-3">
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