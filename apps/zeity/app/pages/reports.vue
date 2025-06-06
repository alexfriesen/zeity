<script setup lang="ts">
import { isAfter, isBefore } from 'date-fns';
import { PROJECT_STATUS_ACTIVE } from '@zeity/types';
import { calculateDiffSum, parseDate, toISOString } from '@zeity/utils/date';
import type { DateRange } from '~/types/date-filter';

const { user } = useUser();
const { isLoggedIn } = useAuth();
const { loadProjects } = useProject();
const { loadTimes, getOrganisationTimes } = useTime();
const { fetchOrganisationMembers, currentOrganisationId } = useOrganisation();

const dateFilter = ref<DateRange>();
const projectFilters = ref<string[]>([]);
const memberFilters = ref<string[]>([]);

const { pending: membersPending, data: membersData, execute: membersExecute } = await fetchOrganisationMembers(currentOrganisationId!);

const orgTimes = getOrganisationTimes();
const filteredUserIds = computed(() => {
    // user is not set if the user is not logged in
    if (!user.value) {
        return [];
    }
    // if no filters are set, return the current user id
    if (!memberFilters.value.length) {
        // TODO: should the default be the current user or all users?
        return [user.value.id];
    }
    // if filters are set, return the filtered user ids
    return memberFilters.value;
});
const filteredTimes = computed(() => {
    const dFilter = dateFilter.value;
    const pFilters = projectFilters.value;
    const userIds = filteredUserIds.value;

    let times = orgTimes.value;

    // filter times by user ids
    if (userIds.length) {
        times = times.filter((item) => item.userId && userIds?.includes(item.userId));
    }

    // filter times by date range
    if (dFilter && dFilter.start && dFilter.end) {
        times = times.filter(
            (item) => {
                const timeStart = parseDate(item.start);

                return isAfter(timeStart, parseDate(dFilter.start)) &&
                    isBefore(timeStart, parseDate(dFilter.end));
            }
        );
    }

    // filter times by project ids
    if (pFilters.length) {
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
    if (!isLoggedIn.value) {
        return;
    }

    await membersExecute();
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
            <OrganisationMemberFilter v-if="user" v-model="memberFilters" :members="membersData"
                :pending="membersPending" />
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

            <ReportDownload :times="filteredTimes" :members="membersData" />
        </UCard>
    </div>
</template>