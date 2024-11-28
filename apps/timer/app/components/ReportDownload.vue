<script setup lang="ts">
import { pick } from '@zeity/utils/object';
import { generateCSV, toCSVBlob } from '@zeity/utils/csv';

import type { Project } from '~/types/project';
import type { Time } from '~/types/time';

const projectStore = useProjectStore();

const props = defineProps({
    times: {
        type: Array as PropType<Time[]>,
        default: () => [],
    },
    projects: {
        type: Array as PropType<Project[]>,
        default: () => [],
    }
});

const format = ref('csv');
const formatOptions = [
    { label: 'CSV', value: 'csv' },
    { label: 'JSON', value: 'json' },
];

type EnhancedTime = Time & { project: string | null };
const exportedFields: (keyof EnhancedTime)[] = ['id', 'start', 'end', 'project', 'notes'] as const;

function downloadReport(type = 'json') {
    const times = props.times;
    const enhancedTimes = times.map((item) => ({
        ...item,
        project: getProjectName(item.projectId),
    }));

    const result = generateReport(type, enhancedTimes);

    if (result) {
        downloadAs(URL.createObjectURL(result), `report.${type}`);
    }
}

function getProjectName(projectId: string | undefined) {
    if (!projectId) {
        return null;
    }

    const project = projectStore.findProjectById(projectId).value;
    if (project) {
        return project.name;
    }

    return null;
}

function generateReport(type: string, data: EnhancedTime[]) {
    switch (type) {
        case 'json':
            return generateJSONReport(data);
        case 'csv':
            return generateCSVReport(data);
    }

    return undefined;
}

function generateJSONReport(data: EnhancedTime[]) {
    const redactedData = data.map((item) => pick(item, exportedFields));
    const jsonString = JSON.stringify(redactedData, null, 2);

    return new Blob([jsonString], { type: 'text/plain' });
}

function generateCSVReport(data: EnhancedTime[]) {
    const csv = generateCSV(exportedFields, data);

    return toCSVBlob(csv);
}
</script>

<template>
    <div class="text-center">
        <UButtonGroup>
            <UButton :label="$t('common.download')" variant="subtle" color="neutral" size="lg" icon="i-lucide-download"
                @click="downloadReport(format)" />
            <USelectMenu v-model="format" :items="formatOptions" value-key="value" class="w-22" />
        </UButtonGroup>
    </div>
</template>