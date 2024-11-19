<script setup lang="ts">
import { PROJECT_STATUS_ACTIVE, type Project } from '~/types/project';

const model = defineModel<string[]>();

const store = useProjectStore();
const projects = store.projects.getAll();
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
    <section class="flex flex-col gap-4 my-3">
        <div class="scrollable flex gap-2 py-2">
            <UButton v-for="value of activeProjects" :key=value.id :label="value.name"
                :icon="isSelected(value) ? 'i-lucide-check' : undefined"
                :color="isSelected(value) ? 'primary' : 'neutral'" class="truncate max-w-48"
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