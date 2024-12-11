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
import type { DateRange as CalendarDateRange } from 'reka-ui';
import { getLocalTimeZone, parseAbsolute } from '@internationalized/date';
import { formatRelativeDateDiff } from '@zeity/utils/date';

import { DateFilterType, type DateFilter, type DateRange } from '~/types/date-filter';

const { t } = useI18n();
const settings = useSettingsStore();

const selectedFilterKey = ref();
const dateFilters = computed(() => getDateFilters(settings.locale));

const model = defineModel<DateRange>();

const state = ref<DateRange>();
const calendarRange = computed({
    get: () => {
        if (!state.value) return;

        const tz = getLocalTimeZone();
        return { start: parseAbsolute(state.value.start, tz), end: parseAbsolute(state.value.end, tz) } as CalendarDateRange;
    },
    set: (value: CalendarDateRange) => {
        if (!value || !value.start || !value.end) return;
        const tz = getLocalTimeZone();
        setDateRange(startOfDay(value.start.toDate(tz)), endOfDay(value.end.toDate(tz)));
    },
});

watch(state, (state) => {
    model.value = state;
});

onMounted(() => {
    changeDateFilter(dateFilters.value[0]);
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

function getDateFilters(locale: string): DateFilter[] {
    return [
        ...getDayFilters(locale),
        ...getWeekFilters(locale, 3),
        ...getMonthFilters(locale, 4),
        ...getYearFilters(locale, 2),
        { key: 'custom', label: t('common.custom'), type: DateFilterType.Custom, value: 0 },
    ];
}

function getDayFilters(locale: string) {
    return [
        {
            key: 'today',
            text: formatRelativeDateDiff(0, locale),
            type: DateFilterType.Day,
            value: new Date().getDay()
        },
        {
            key: 'yesterday',
            text: formatRelativeDateDiff(-1, locale),
            type: DateFilterType.Day,
            value: subDays(new Date(), 1).getDay(),
        },
    ];
}

function getWeekFilters(locale: string, count: number) {
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

function getMonthFilters(locale: string, count: number) {
    const now = new Date();

    const filters = [];
    for (let i = 0; i < count; i++) {
        const date = subMonths(now, i);
        const month = date.getMonth();
        const monthName = date.toLocaleString(locale, { month: 'short' });
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

function getYearFilters(locale: string, count: number) {
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
        <div v-show="selectedFilterKey === 'custom'" class="flex m-auto">
            <UCalendar v-model="calendarRange" range />
        </div>
    </section>
</template>

<style scoped>
.scrollable {
    overflow: auto;
    scroll-behavior: smooth;
}
</style>