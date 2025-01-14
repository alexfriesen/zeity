<script setup lang="ts">
import { nanoid } from 'nanoid';

import { PROJECT_STATUS_ACTIVE, type Project } from '~/types/project';

const router = useRouter();
const store = useProjectStore();

const data = ref<Project>({
    id: nanoid(),
    status: PROJECT_STATUS_ACTIVE,
    name: '',
    notes: '',
});

function handleSubmit(data: Project) {
    store.insertProject(data);

    router.push('/projects');
}
</script>

<template>
    <UContainer as="section" class="page my-3">
        <UBreadcrumb :items="[{ label: $t('projects.title'), to: '/projects' }]" />
        <h2
            class="inline-block text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight dark:text-neutral-200">
            {{ $t('projects.create.title') }}
        </h2>

        <ProjectForm :data="data" class="mt-4" @submit="handleSubmit" />
    </UContainer>
</template>