<script setup lang="ts">
import type { Project } from '~/types/project';


const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()

definePageMeta({
    validate: async (route) => {
        // Check if the id is made up of digits
        return typeof route.params.id === 'string'
    }
})

const projectId = route.params.id as string;

const project = projectStore.projects.getById(projectId)

function save(data: Project) {
    projectStore.projects.update(projectId, data)

    router.push(`/projects/${projectId}`);
}

</script>

<template>
    <UContainer class="my-4">
        <UBreadcrumb :items="[{ label: 'Projects', to: '/projects' }]" />
        <h2
            class="inline-block text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight dark:text-neutral-200">
            Edit: {{ project?.name }}
        </h2>
        <ProjectForm v-if="project" :data="project" class="mt-4" @submit="save" />
    </UContainer>
</template>