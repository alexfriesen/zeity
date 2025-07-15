<script setup lang="ts">
import { isAfter, isBefore } from 'date-fns';
import { PROJECT_STATUS_ACTIVE } from '@zeity/types';
import { calculateDiffSum, parseDate, toISOString } from '@zeity/utils/date';
import type { OrganisationTeam } from '@zeity/database/organisation-team';
import type { OrganisationMemberWithUser } from '~/types/organisation';
import type { DateRange } from '~/types/date-filter';

const { user } = useUser();
const { isLoggedIn } = useAuth();
const { loadProjects } = useProject();
const { loadTimes, getOrganisationTimes } = useTime();
const { currentOrganisationId } = useOrganisation();

const dateFilter = ref<DateRange>();
const projectFilters = ref<string[]>([]);
const teamFilters = ref<OrganisationTeam[]>([]);
const memberFilters = ref<OrganisationMemberWithUser[]>([]);

const orgTimes = getOrganisationTimes();
const filteredTeamIds = computed(() => {
    return teamFilters.value.map(team => team.id);
});
const filteredUserIds = computed(() => {
    // user is not set if the user is not logged in
    if (!user.value) {
        return [];
    }
    // if filters are set, return the filtered user ids
    return memberFilters.value.map(member => member.userId);
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

    await loadAllActiveProjects();
    if (dateFilter.value) {
        await loadAllTimes(dateFilter.value, projectFilters.value, filteredUserIds.value);
    }
}

onMounted(async () => {
    await reloadAll();
});

watch(currentOrganisationId, async () => {
    await reloadAll();
});

watch([dateFilter, projectFilters, filteredUserIds], async ([dateRange, projects, users]) => {
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
            <OrganisationTeamFilter v-if="user" v-model="teamFilters" />
            <OrganisationMemberFilter v-if="user" v-model="memberFilters" :team-ids="filteredTeamIds" />
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

            <ReportDownload :times="filteredTimes" :members="memberFilters" />
        </UCard>
    </div>
</template>