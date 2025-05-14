<script setup lang="ts">
import { isAfter, isBefore } from 'date-fns';
import { PROJECT_STATUS_ACTIVE } from '@zeity/types';
import { calculateDiffSum, parseDate, toISOString } from '@zeity/utils/date';

import type { DateRange } from '~/types/date-filter';

const { user } = useUser();
const { currentOrganisationId } = useOrganisation();
const { loadTimes, getOrganisationTimes } = useTime();
const { loadProjects } = useProject();

const dateFilter = ref<DateRange>();
const projectFilters = ref<string[]>([]);
const memberFilters = ref<string[]>([]);

const orgTimes = getOrganisationTimes();
const filteredUserIds = computed(() => {
    // user is not set if the user is not logged in
    if (!user.value) {
        return [];
    }
    // if no filters are set, return the current user id
    if (!memberFilters.value.length) {
        return [user.value.id];
    }
    // if filters are set, return the filtered user ids
    return memberFilters.value;
});
const filteredTimes = computed(() => {
    const dFilter = dateFilter.value;
    const pFilters = projectFilters.value;

    const userIds = filteredUserIds.value;
    let times = orgTimes.value.filter((item) => {
        return userIds?.some((userId) => item.userId === userId);
    });

    if (dFilter && dFilter.start && dFilter.end) {
        times = times.filter(
            (item) => {
                const timeStart = parseDate(item.start);

                return isAfter(timeStart, parseDate(dFilter.start)) &&
                    isBefore(timeStart, parseDate(dFilter.end));
            }
        );
    }

    if (projectFilters.value.length) {
        times = times.filter((item) =>
            pFilters?.some((project) => item.projectId?.includes(project)),
        );
    }

    return times;
});

const timeSum = computed(() => calculateDiffSum(filteredTimes.value));

async function loadAllTimes(range: DateRange, projectIds: string[], userIds: string[], limit = 100) {
    let offset = 0;
    let endReached = false;
    while (!endReached) {
        const times = await loadTimes({
            limit,
            offset,
            userId: userIds,
            projectId: projectIds,
            rangeStart: toISOString(range.start),
            rangeEnd: toISOString(range.end),
        });

        offset += limit;
        if ((times?.length ?? 0) < limit) {
            endReached = true;
        }
    }
}

async function loadAllActiveProjects(status = [PROJECT_STATUS_ACTIVE], limit = 100) {
    let offset = 0;
    let endReached = false;
    while (!endReached) {
        const projects = await loadProjects({
            limit,
            offset,
            status,
        });

        offset += limit;
        if ((projects?.length ?? 0) < limit) {
            endReached = true;
        }
    }
}

async function reloadAll() {
    await loadAllActiveProjects();
    if (dateFilter.value) {
        await loadAllTimes(dateFilter.value, projectFilters.value, memberFilters.value);
    }
}

onMounted(async () => {
    await reloadAll();
});

watch(currentOrganisationId, async () => {
    await reloadAll();
});

watch([dateFilter, projectFilters, memberFilters], async ([dateRange, projects, users]) => {
    if (dateRange && dateRange.start && dateRange.end) {
        await loadAllTimes(dateRange, projects, users);
    }
});
</script>

<template>
    <div class="my-3 space-y-6">
        <section class="flex flex-col gap-1">
            <DateFilter v-model="dateFilter" />
            <ProjectFilter v-model="projectFilters" />
            <OrganisationMemberFilter v-if="user" v-model="memberFilters" />
        </section>

        <UCard as="section">
            <template #header>
                <h2>{{ $t('reports.summary') }}</h2>
            </template>

            <TimeDurationFlowing v-model="timeSum" class="flex justify-center text-xl font-mono" />
        </UCard>

        <UCard as="section">
            <template #header>
                <h2>{{ $t('reports.report') }}</h2>
            </template>

            <ReportDownload :times="filteredTimes" />
        </UCard>
    </div>
</template>