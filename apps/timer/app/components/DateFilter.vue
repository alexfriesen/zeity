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

const selectedFilterKey = ref('today');
const dateFilters = getDateFilters();

const model = defineModel<Schema | DateRange>();

const schema = z.object({
    start: z.string().date().default(new Date().toISOString()),
    end: z.string().date().default(new Date().toISOString()),
});
type Schema = z.output<typeof schema>
const state = ref<Schema>({
    start: new Date().toISOString(),
    end: new Date().toISOString(),
});

watch(state, (state) => {
    model.value = state;
});

function onChangeDateFilter(event?: DateFilter) {
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

function isSelected(item: DateFilter) {
    return item.key === selectedFilterKey.value;
}
</script>

<template>
    <section class="flex flex-col gap-4 my-3">
        <div class="scrollable flex gap-2 py-2">
            <UButton v-for="value of dateFilters" :key=value.key :label="value.label || value.text"
                :icon="isSelected(value) ? 'i-lucide-check' : undefined"
                :color="isSelected(value) ? 'primary' : 'neutral'" variant="subtle" class="rounded-full"
                @click="onChangeDateFilter(value)" />
        </div>
        <form v-show="selectedFilterKey === 'custom'">
            <UForm :schema="schema" :state="state">
                <UFormField label="Start" name="start">
                    <UInput v-model="state.start" type="date" class="w-full" />
                </UFormField>
                <UFormField label="End" name="end">
                    <UInput v-model="state.end" type="date" class="w-full" />
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