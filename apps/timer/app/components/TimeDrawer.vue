<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'
import { nanoid } from 'nanoid';
import z from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';

import { formatDuration, timeDiff } from '@zeity/utils/date';
import type { DraftTime, Time } from '~/types/time';
import { PROJECT_STATUS_ACTIVE } from '~/types/project';

const projectStore = useProjectStore();
const activeProjects = projectStore.findProject((project) => project.status === PROJECT_STATUS_ACTIVE);
const projectItems = computed(() => {
    const projectOptions = activeProjects.value.map((project) => ({
        label: project.name,
        value: project.id,
    }));
    return [
        { label: 'No project', value: undefined },
        ...projectOptions
    ];
})

const timeStore = useTimerStore();

const {
    currentTime,
    isOpen,
    close,
} = useTimeDetail();

const isDraft = computed(() => isDraftValue(currentTime?.value));

const now = ref(new Date());
const { pause, resume } = useIntervalFn(() => {
    now.value = new Date();
}, 1000, { immediateCallback: true });

onUnmounted(() => {
    pause();
});

watch([isDraft, isOpen], ([isDraft, isOpen]) => {
    if (isOpen && currentTime.value) {
        const clone = structuredClone(toRaw(currentTime.value));

        state.value = clone;
    }

    if (isDraft && isOpen) {
        resume();
    } else {
        pause();
    }
});

const runningDuration = computed(() => {
    const time = state?.value as Schema;

    const start = time?.start;
    const end = isTimeValue(time) ? time.end : now.value;

    if (start && end) {
        return formatDuration(timeDiff(end, start));
    }

    return '00:00:00';
});

const timeSchema = z.object({
    id: z.string().default(nanoid()),
    start: z.coerce.string().date(),
    end: z.coerce.string().date(),
    notes: z.string().default(''),

    projectId: z.string().optional(),
});
const draftSchema = timeSchema.pick({ start: true, notes: true, projectId: true });
const schema = z.union([timeSchema, draftSchema]);

type Schema = z.output<typeof schema>
const state = ref<Schema>();

function handleTimeDetailOpenUpdate(state: boolean) {
    if (!state) {
        close();
    }
}

function handleSave(event: FormSubmitEvent<Schema>) {
    const time = event.data

    if (isDraftValue(time)) {
        timeStore.updateDraft(time);
    }
    if (isTimeValue(time)) {
        if (time.id === 'new') {
            timeStore.insertTime({ ...time, id: nanoid() });
        } else {
            timeStore.updateTime(time.id, time);
        }
    }

    close();
}

function handleRemove() {
    if (isDraft.value) {
        timeStore.resetDraft();
    }

    if (isTimeValue(currentTime?.value)) {
        timeStore.removeTime(currentTime.value.id);
    }

    close();
}

function isDraftValue(value: Time | DraftTime | Schema | undefined | null): value is DraftTime {
    return !!value && !('end' in value);
}
function isTimeValue(value?: Time | DraftTime | Schema | undefined | null): value is Time {
    return !!value && 'end' in value;
}
</script>

<template>
    <UDrawer :open="isOpen" :ui="{ container: 'max-w-xl mx-auto' }" title="Time Detail" description="Edit time details"
        @update:open="handleTimeDetailOpenUpdate">
        <template #header>
            <div class="text-center">
                <span class="font-mono text-2xl tabular-nums lining-nums tracking-wide">
                    {{ runningDuration }}
                </span>
            </div>
        </template>
        <template #body>
            <UForm v-if="state" :scheme="schema" :state="state" class="space-y-4" @submit="handleSave">

                <UFormField label="Start time" name="start">
                    <DateTimeField v-model="state.start" />
                </UFormField>
                <UFormField label="End time" name="end">
                    <DateTimeField v-if="isTimeValue(state)" v-model="state.end" />
                </UFormField>

                <UFormField label="Project" name="projectId">
                    <USelectMenu v-model="state.projectId" value-key="value" :items="projectItems" class="w-full" />
                </UFormField>

                <UFormField label="Notes" name="notes">
                    <UTextarea v-model="state.notes" type="text" class="w-full" autoresize />
                </UFormField>

                <div class="flex justify-evenly">
                    <UButton type="button" color="error" @click="handleRemove">Remove</UButton>
                    <UButton type="submit">Save</UButton>
                </div>
            </UForm>
        </template>
    </UDrawer>
</template>
