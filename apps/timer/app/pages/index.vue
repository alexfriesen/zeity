<script setup lang="ts">
import { sortDatesDescending } from '@timer/utils/date';

import { useTimerStore } from '~/stores/timerStore';

const timerStore = useTimerStore();
const allTimes = timerStore.times.getAll();
const sortedTimes = computed(() => allTimes.value.toSorted((a, b) => sortDatesDescending(a.start, b.start)));
</script>

<template>
    <div class="page">

        <TimeDrawer />

        <section class="main">
            <TimeList class="mb-4" :times="sortedTimes" />
        </section>

        <footer class="footer">
            <DraftTimer />
        </footer>

    </div>
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
