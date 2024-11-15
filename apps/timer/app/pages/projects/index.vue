<script setup lang="ts">
import { useProjectStore } from '~/stores/projectStore';
import { PROJECT_STATUS_ACTIVE, PROJECT_STATUS_CLOSED } from '~/types/project';

const showClosed = ref(false);

const projectStatusFilter = computed(() => {
    if (showClosed.value) {
        return [PROJECT_STATUS_ACTIVE, PROJECT_STATUS_CLOSED];
    }
    return [PROJECT_STATUS_ACTIVE];
});

const store = useProjectStore();
const projects = store.projects.getAll();

const filteredProjects = computed(() => {
    return projects.value.filter((project) => projectStatusFilter.value.includes(project.status));
});
</script>

<template>
    <UContainer class="page my-3">
        <section class="flex flex-col md:flex-row justify-between">
            <h2>Projects</h2>
        </section>
        <USeparator orientation="horizontal" class="mb-6" />
        <section class="flex flex-col my-3 space-y-4">
            <div class="flex flex-col md:flex-row justify-between">
                <USwitch v-model="showClosed" label="Closed Projects" />

                <UButton to="/projects/create">Create Project</UButton>
            </div>

            <UCard v-for="project in filteredProjects" :key="project.id">
                <template #header>
                    <h3>{{ project.name }}</h3>
                </template>
                <template #body>
                    <p>{{ project.id }}</p>
                </template>
            </UCard>
        </section>
    </UContainer>
</template>