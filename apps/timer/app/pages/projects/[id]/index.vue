<script setup lang="ts">
import type { ProjectStatus } from '~/types/project';

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()
const timeStore = useTimerStore()

definePageMeta({
    validate: async (route) => {
        // Check if the id is made up of digits
        return typeof route.params.id === 'string'
    }
})

const projectId = route.params.id as string;

const project = projectStore.projects.getById(projectId)
const projectTimes = timeStore.times.find((time) => time.projectId === projectId)

if (!project) {
    router.push('/projects')
}

function updateStatus(status: ProjectStatus | string) {
    projectStore.projects.update(projectId, { status: status as ProjectStatus })

    router.push(`/projects/${projectId}`);
}

</script>

<template>
    <UContainer v-if="project" class="my-4">
        <UBreadcrumb :items="[{ label: 'Projects', to: '/projects' }]" />
        <h2
            class="mb-2 inline-block text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight dark:text-neutral-200">
            {{ project.name }}
        </h2>

        <div class="my-4 flex justify-between gap-2">
            <USelect v-model="project.status" :items="projectStatusFormItems" @update:model-value="updateStatus">
                <template #leading="{ modelValue, ui }">
                    <UChip v-if="modelValue" inset standalone :color="getProjectStatusColor(project.status)"
                        :size="ui.itemLeadingChipSize()" :class="ui.itemLeadingChip()" />
                </template>
            </USelect>
            <UButton :to="`/projects/${encodeURIComponent(projectId)}/edit`">Edit</UButton>
        </div>

        <p>{{ project.notes }}</p>

        <USeparator orientation="horizontal" class="my-4" />

        <div class="my-4">
            <h3
                class="mb-2 inline-block text-md sm:text-lg font-extrabold text-neutral-900 tracking-tight dark:text-neutral-200">
                Times
            </h3>
            <div>
                <TimeList :times="projectTimes" />
            </div>
        </div>
    </UContainer>
</template>