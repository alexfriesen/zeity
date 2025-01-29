<script setup lang="ts">
import { calculateDiffSum, formatDuration } from '@zeity/utils/date';
import type { ProjectStatus } from '@zeity/types/project';

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

const project = projectStore.findProjectById(projectId)
const projectTimes = timeStore.findTime((time) => time.projectId === projectId)
const projectTimeSum = computed(() => formatDuration(calculateDiffSum(projectTimes.value)));

if (!project) {
    router.push('/projects')
}

function updateStatus(status: ProjectStatus | string) {
    projectStore.updateProject(projectId, { status: status as ProjectStatus })

    router.push(`/projects/${projectId}`);
}

</script>

<template>
    <UContainer v-if="project" class="my-4">
        <UBreadcrumb :items="[{ label: $t('projects.title'), to: '/projects' }]" />
        <h2
            class="mb-2 inline-block text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight dark:text-neutral-200">
            {{ project.name }}
        </h2>

        <div class="my-4 flex justify-between gap-2">
            <ProjectStatusSelect v-model="project.status" class="min-w-40" @update:model-value="updateStatus" />
            <UButton :to="`/projects/${encodeURIComponent(projectId)}/edit`">
                {{ $t('common.edit') }}
            </UButton>
        </div>

        <p>{{ project.notes }}</p>

        <USeparator orientation="horizontal" class="my-4" />

        <div class="my-4">
            <div class="flex justify-between">
                <h3
                    class="mb-2 inline-block text-md sm:text-lg font-extrabold text-neutral-900 tracking-tight dark:text-neutral-200">
                    {{ $t('times.title') }}
                </h3>
                <p class="font-sans text-md tabular-nums">
                    <span class="text-sm text-[var(--ui-text-muted)]">Total:</span>
                    {{ projectTimeSum }}
                </p>
            </div>
            <div>
                <TimeList :times="projectTimes" />
            </div>
        </div>
    </UContainer>
</template>