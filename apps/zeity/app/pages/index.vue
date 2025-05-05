<script setup lang="ts">
import { sortDatesDescending } from '@zeity/utils/date';

const timeDetail = useTimeDetail();
const timerStore = useTimerStore();
const { currentOrganisationId } = useOrganisation();
const { loadTimes, toggleDraft, getOrganisationTimes } = useTime();

const orgTimes = getOrganisationTimes();
const sortedTimes = computed(() => orgTimes.value.toSorted((a, b) => sortDatesDescending(a.start, b.start)));
const isEmpty = computed(() => orgTimes.value.length < 1);

function timeNew() {
    const now = new Date().toISOString();
    timeDetail.open({ id: 'new', start: now, duration: 0, notes: '' });
}

const offset = ref(0);
const limit = ref(40);
const isLoading = ref(false);
const endReached = ref(true);

function reloadAll() {
    offset.value = 0;
    endReached.value = false;
    loadMore();
}

function loadMore() {
    if (isLoading.value) return;
    isLoading.value = true;

    loadTimes({ offset: offset.value, limit: limit.value })
        .then((data) => {
            offset.value += data?.length || 0;
            if ((data?.length ?? 0) < limit.value) {
                endReached.value = true;
            }
        })
        .finally(() => {
            isLoading.value = false;
        });

}

onMounted(() => {
    reloadAll();
});

watch(toRef(currentOrganisationId), () => {
    reloadAll();
});
</script>

<template>
    <div class="flex flex-col h-full">

        <TimeDrawer />

        <section class="grow py-3 my-3">
            <TimeList default-open :times="sortedTimes" />

            <UAlert v-if="isEmpty" variant="subtle" title="Hey there!"
                description="It looks like you haven't tracked any time yet. Start tracking time by clicking the button below."
                icon="i-lucide-info" :ui="{ icon: 'size-20' }" :actions="[
                    { label: `${timerStore.isStarted ? 'Stop' : 'Start'} time tracker`, icon: 'i-lucide-play', onClick: toggleDraft },
                    { label: 'Add time', icon: 'i-lucide-plus', onClick: timeNew }
                ]" />

            <UButton v-if="!endReached" block class="mt-2" variant="subtle" :loading="isLoading" :disabled="isLoading"
                @click="loadMore">
                {{ $t('common.loadMore') }}
            </UButton>
        </section>

        <footer class="sticky bottom-16 md:bottom-3">
            <TimeDraft />
        </footer>

    </div>
</template>
