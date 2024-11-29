<script setup lang="ts">
import {
    setDay,
    subDays,
    endOfDay,
    startOfDay,
    getWeek,
    setWeek,
    subWeeks,
    startOfWeek,
    setMonth,
    subMonths,
    endOfMonth,
    startOfMonth,
    setYear,
    subYears,
    endOfYear,
    startOfYear,
    addDays,
} from 'date-fns';
import { z } from 'zod';

import { DateFilterType, type DateFilter, type DateRange } from '~/types/date-filter';

const settings = useSettingsStore();

const selectedFilterKey = ref();
const dateFilters = getDateFilters();

const model = defineModel<Schema | DateRange>();

const schema = z.object({
    start: z.string().date(),
    end: z.string().date(),
});
type Schema = z.output<typeof schema>
const state = ref<Schema>();

watch(state, (state) => {
    model.value = state;
});

onMounted(() => {
    changeDateFilter(dateFilters[0]);
});

function changeDateFilter(event?: DateFilter) {
    switch (event?.type) {
        case 'day':
            setDateRangeDay(setDay(new Date(), event.value));
            break;

        case 'week':
            setDateRangeWeek(setWeek(new Date(), event.value));
            break;

        case 'month':
            setDateRangeMonth(setMonth(new Date(), event.value));
            break;

        case 'year':
            setDateRangeYear(setYear(new Date(), event.value));
            break;
    }

    selectedFilterKey.value = event?.key || 'custom';
}

function setDateRangeDay(date: Date) {
    const start = startOfDay(date);
    const end = endOfDay(date);
    setDateRange(start, end);
}

function setDateRangeWeek(date: Date) {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfDay(addDays(start, 7));
    setDateRange(start, end);
}

function setDateRangeMonth(date: Date) {
    const start = startOfMonth(date);
    const end = endOfMonth(start);
    setDateRange(start, end);
}

function setDateRangeYear(date: Date) {
    const start = startOfYear(date);
    const end = endOfYear(start);
    setDateRange(start, end);
}

function setDateRange(start: Date, end: Date) {
    state.value = { start: start.toISOString(), end: end.toISOString() };
}

function getDateFilters(): DateFilter[] {
    return [
        ...getDayFilters(),
        ...getWeekFilters(3),
        ...getMonthFilters(4),
        ...getYearFilters(2),
        { key: 'custom', label: 'Custom Filter', type: DateFilterType.Custom, value: 0 },
    ];
}

function getDayFilters() {
    return [
        { key: 'today', label: 'Today', type: DateFilterType.Day, value: new Date().getDay() },
        {
            key: 'yesterday',
            label: 'Yesterday',
            type: DateFilterType.Day,
            value: subDays(new Date(), 1).getDay(),
        },
    ];
}

function getWeekFilters(count: number) {
    const now = new Date();

    const filters = [];
    for (let i = 0; i < count; i++) {
        const date = subWeeks(now, i);
        const week = getWeek(date);
        filters.push({
            key: 'kw' + week,
            text: `KW ${week}`,
            type: DateFilterType.Week,
            value: week,
        });
    }

    return filters;
}

function getMonthFilters(count: number) {
    const now = new Date();

    const filters = [];
    for (let i = 0; i < count; i++) {
        const date = subMonths(now, i);
        const month = date.getMonth();
        const monthName = date.toLocaleString(settings.language, { month: 'short' });
        filters.push({
            key: 'm' + month,
            // label: `Month.${month}`,
            text: monthName,
            type: DateFilterType.Month,
            value: month,
        });
    }

    return filters;
}

function getYearFilters(count: number) {
    const now = new Date();

    const filters = [];
    for (let i = 0; i < count; i++) {
        const date = subYears(now, i);
        const year = date.getFullYear();
        filters.push({
            key: 'y' + year,
            text: `${year}`,
            type: DateFilterType.Year,
            value: year,
        });
    }

    return filters;
}

function isSelected(filter: DateFilter) {
    return filter.key === selectedFilterKey.value;
}
</script>

<template>
    <section class="flex flex-col gap-4 my-3">
        <div class="scrollable flex gap-2 py-2">
            <UButton v-for="filter of dateFilters" :key=filter.key :label="filter.label || filter.text"
                :icon="isSelected(filter) ? 'i-lucide-check' : undefined"
                :color="isSelected(filter) ? 'primary' : 'neutral'" variant="subtle" class="rounded-full"
                @click="changeDateFilter(filter)" />
        </div>
        <form v-show="selectedFilterKey === 'custom'">
            <UForm v-if="state" :schema="schema" :state="state">
                <UFormField label="Start" name="start">
                    <DateTimeField v-model="state.start" granularity="day" class="w-full" />
                </UFormField>
                <UFormField label="End" name="end">
                    <DateTimeField v-model="state.end" granularity="day" class="w-full" />
                </UFormField>
            </UForm>
        </form>
    </section>
</template>

<style scoped>
.scrollable {
    overflow: auto;
    scroll-behavior: smooth;
}
</style>