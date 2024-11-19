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
        <h2
            class="inline-block text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight dark:text-neutral-200">
            Projects
        </h2>

        <section class="flex flex-col my-3 space-y-4">
            <div class="flex items-center justify-between gap-4">
                <USwitch v-model="showClosed" label="Closed Projects" />

                <UButton to="/projects/create" icon="i-lucide-plus">Create Project</UButton>
            </div>

            <UCard v-for="project in filteredProjects" :key="project.id">
                <template #header>
                    <div class="flex justify-between gap-4 flex-shrink">
                        <UButton :to="`/projects/${encodeURIComponent(project.id)}`" variant="link"
                            class="block truncate">
                            {{ project.name }}
                        </UButton>

                        <UBadge variant="subtle" :color="getProjectStatusColor(project.status)">
                            {{ project.status }}
                        </UBadge>
                    </div>
                </template>

                <p class="line-clamp-3">{{ project.notes }}</p>
            </UCard>
        </section>
    </UContainer>
</template>