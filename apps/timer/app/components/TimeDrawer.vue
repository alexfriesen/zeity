<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'
import { nanoid } from 'nanoid';
import z from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';

import { timeDiff } from '@zeity/utils/date';
import type { DraftTime, Time } from '~/types/time';
import { PROJECT_STATUS_ACTIVE } from '~/types/project';

const { t } = useI18n();

const projectStore = useProjectStore();
const activeProjects = projectStore.findProject((project) => project.status === PROJECT_STATUS_ACTIVE);
const projectItems = computed(() => {
    const projectOptions = activeProjects.value.map((project) => ({
        label: project.name,
        value: project.id,
    }));
    return [
        { label: t('times.noProject'), value: undefined },
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

const diff = computed(() => {
    const time = state?.value as Schema;

    if (isTimeValue(time) && time.duration) {
        return time.duration;
    }

    const start = time?.start;
    const end = isTimeValue(time) ? time.end : now.value;

    if (start && end) {
        return timeDiff(end, start);
    }

    return 0;
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
        time.duration = timeDiff(time.end, time.start);
        if (time.id === 'new') {
            timeStore.insertTime({ ...time, id: nanoid() });
        } else {
            timeStore.updateTime(time.id, time);
        }
    }

    close();
}

function stop() {
    timeStore.stopDraft();
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
    return !!value && ('end' in value || 'duration' in value);
}
</script>

<template>
    <UDrawer :open="isOpen" :ui="{ container: 'max-w-xl mx-auto' }" title="Time Detail" description="Edit time details"
        @update:open="handleTimeDetailOpenUpdate">
        <template #header>
            <TimeDurationFlowing v-model="diff"
                class="flex justify-center font-mono text-2xl tabular-nums lining-nums tracking-wide" />
        </template>
        <template #body>
            <UForm v-if="state" :scheme="schema" :state="state" class="space-y-4" @submit="handleSave">
                <UFormField :label="$t('times.form.start')" name="start">
                    <DateTimeField v-model="state.start" />
                </UFormField>

                <UFormField v-if="isTimeValue(state) && state.end" :label="$t('times.form.end')" name="end">
                    <DateTimeField v-if="isTimeValue(state)" v-model="state.end" />
                </UFormField>

                <UFormField :label="$t('times.form.project')" name="projectId">
                    <USelectMenu v-model="state.projectId" value-key="value" :items="projectItems" class="w-full"
                        :ui="{ content: 'pointer-events-auto' }" />
                </UFormField>

                <UFormField :label="$t('times.form.notes')" name="notes">
                    <UTextarea v-model="state.notes" type="text" class="w-full" autoresize />
                </UFormField>

                <div class="flex justify-evenly">
                    <UButton type="button" color="error" variant="subtle" @click="handleRemove">
                        {{ $t('common.delete') }}
                    </UButton>

                    <UButton v-if="isDraft" type="button" color="neutral" variant="subtle" @click="stop">
                        {{ $t('common.stop') }}
                    </UButton>

                    <UButton type="submit" variant="subtle">
                        {{ $t('common.save') }}
                    </UButton>
                </div>
            </UForm>
        </template>
    </UDrawer>
</template>
