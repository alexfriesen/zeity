<script setup lang="ts">
import { PROJECT_STATUS_ACTIVE, PROJECT_STATUS_CLOSED, PROJECT_STATUSES } from '@zeity/types/project';

const showClosed = ref(false);

const projectStatusFilter = computed(() => {
    if (showClosed.value) {
        return [PROJECT_STATUS_ACTIVE, PROJECT_STATUS_CLOSED];
    }
    return [PROJECT_STATUS_ACTIVE];
});

const { loggedIn } = useUserSession();
const { currentOrganisationId } = useOrganisation();
const { loadProjects, isOnlineProject, getOrganisationProjects } = useProject();

const projects = getOrganisationProjects();
const isEmpty = computed(() => projects.value.length === 0);

const filteredProjects = computed(() => {
    return projects.value.filter((project) => projectStatusFilter.value.includes(project.status));
});

const offset = ref(0);
const limit = ref(20);
const isLoading = ref(false);
const endReached = ref(false);

function reloadAll() {
    offset.value = 0;
    endReached.value = false;
    loadMore();
}

function loadMore() {
    if (isLoading.value) return;
    isLoading.value = true;

    loadProjects({
        offset: offset.value,
        limit: limit.value,
        status: (showClosed.value ? PROJECT_STATUSES : [PROJECT_STATUS_ACTIVE]) as string[],
    })
        .then((data) => {
            offset.value += data?.length || 0;
            if (!data?.length) {
                endReached.value = true;
            }
        })
        .finally(() => {
            isLoading.value = false;
        });
}

watch(showClosed, () => {
    reloadAll();
});

watch(currentOrganisationId, () => {
    reloadAll();
});

onMounted(() => {
    loadMore();
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

                        <div class="flex items-center gap-2">
                            <UTooltip v-if="loggedIn && !isOnlineProject(project)" :text="$t('projects.offline')">
                                <UIcon name="i-lucide-cloud-off" />
                            </UTooltip>
                            <UBadge variant="subtle" :color="getProjectStatusColor(project.status)">
                                {{ $t(`projects.status.${project.status}`) }}
                            </UBadge>
                        </div>
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