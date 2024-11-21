<script setup lang="ts">
import { sortDatesDescending } from '@zeity/utils/date';

import { useTimerStore } from '~/stores/timerStore';

const timerStore = useTimerStore();
const allTimes = timerStore.times.getAll();
const sortedTimes = computed(() => allTimes.value.toSorted((a, b) => sortDatesDescending(a.start, b.start)));
</script>

<template>
    <UContainer class="page">

        <TimeDrawer />

        <section class="main my-3">
            <TimeList default-open class="mb-4" :times="sortedTimes" />
        </section>

        <footer class="footer">
            <DraftTimer />
        </footer>

    </UContainer>
</template>

<style scoped>
.page {
    height: 100%;

    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
    grid-template-areas:
        'main'
        'footer';
}

.main {
    grid-area: main;
    overflow: auto;
    padding: 0.725rem;
}

.footer {
    grid-area: footer;
}
</style>
