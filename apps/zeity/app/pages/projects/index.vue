<script setup lang="ts">
import { useProjectStore } from '~/stores/projectStore';
import { PROJECT_STATUS_ACTIVE, PROJECT_STATUS_CLOSED } from '@zeity/types/project';

const showClosed = ref(false);

const projectStatusFilter = computed(() => {
    if (showClosed.value) {
        return [PROJECT_STATUS_ACTIVE, PROJECT_STATUS_CLOSED];
    }
    return [PROJECT_STATUS_ACTIVE];
});

const store = useProjectStore();
const projects = store.getAllProjects();
const isEmpty = computed(() => projects.value.length === 0);

const filteredProjects = computed(() => {
    return projects.value.filter((project) => projectStatusFilter.value.includes(project.status));
});
</script>

<template>
    <div class="page my-3">
        <h2
            class="inline-block text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight dark:text-neutral-200">
            {{ $t('projects.title') }}
        </h2>

        <section class="flex flex-col my-3 space-y-4">
            <div class="flex items-center justify-between gap-4">
                <USwitch v-model="showClosed" :label="$t('projects.showClosed')" />

                <UButton to="/projects/create" icon="i-lucide-plus">{{ $t('common.add') }}</UButton>
            </div>

            <UCard v-for="project in filteredProjects" :key="project.id">
                <template #header>
                    <div class="flex justify-between gap-4 flex-shrink">
                        <UButton :to="`/projects/${encodeURIComponent(project.id)}`" variant="link"
                            class="block -mx-3 truncate">
                            {{ project.name }}
                        </UButton>

                        <UBadge variant="subtle" :color="getProjectStatusColor(project.status)">
                            {{ $t(`projects.status.${project.status}`) }}
                        </UBadge>
                    </div>
                </template>

                <p class="line-clamp-3">{{ project.notes }}</p>
            </UCard>

            <UAlert v-if="isEmpty" variant="subtle" title="Hey there!"
                description="It looks like you don't have any projects yet. Why not create one?" icon="i-lucide-info"
                :ui="{ icon: 'size-20' }" :actions="[
                    { label: $t('common.add'), icon: 'i-lucide-plus', to: '/projects/create' }
                ]" />
        </section>
    </div>
</template>