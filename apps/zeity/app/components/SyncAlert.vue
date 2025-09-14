<script setup lang="ts">
const loading = ref(false);

const toast = useToast();
const { t } = useI18n();

const { syncOfflineTimes, syncOfflineProjects } = useSync();

const { getOfflineTimes } = useTime();
const times = getOfflineTimes();
const hasOfflineTimes = computed(() => times.value.length > 0);

const { getOfflineProjects } = useProject();
const projects = getOfflineProjects();
const hasOfflineProjects = computed(() => projects.value.length > 0);

const hasOfflineData = computed(() => hasOfflineTimes.value || hasOfflineProjects.value);

async function handleSyncOffline() {
    if (loading.value) return;
    loading.value = true;

    const projectsToSync = projects.value;
    await syncOfflineProjects(projectsToSync.map(p => p.id))
        .then((result) => {
            toast.add({
                color: 'success',
                title: t('sync.projects.successTitle'),
                description: t('sync.projects.successMessage', result?.length || 0),
                duration: 5000,
            });
        })
        .catch((error) => {
            console.error('Error syncing offline projects:', error);
            toast.add({
                color: 'error',
                title: t('sync.projects.errorTitle'),
                description: t('sync.projects.errorMessage'),
                duration: 5000,
            });
        });

    const timesToSync = times.value;
    await syncOfflineTimes(timesToSync.map(t => t.id))
        .then((result) => {
            toast.add({
                color: 'success',
                title: t('sync.times.successTitle'),
                description: t('sync.times.successMessage', result?.length || 0),
                duration: 5000,
            });

        })
        .catch((error) => {
            console.error('Error syncing offline times:', error);
            toast.add({
                color: 'error',
                title: t('sync.times.errorTitle'),
                description: t('sync.times.errorMessage'),
                duration: 5000,
            });
        });

    loading.value = false;
}
</script>

<template>
    <UAlert v-if="hasOfflineData" :title="$t('sync.title')" :description="$t('sync.description')"
        icon="i-lucide-cloud-upload" :actions="[
            { label: $t('sync.button'), onClick: handleSyncOffline, loading: loading, disabled: loading },
        ]" />

    {{ times.length }}
</template>