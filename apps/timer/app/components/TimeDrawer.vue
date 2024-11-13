<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'
import { nanoid } from 'nanoid';
import z from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';

import { formatDuration, timeDiff } from '@zeity/utils/date';
import type { DraftTime, Time } from '~/types/time';

const store = useTimerStore();

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
    id: z.string(),
    start: z.coerce.string().date(),
    end: z.coerce.string().date(),
    notes: z.string().default(''),
});
const draftSchema = timeSchema.pick({ start: true, notes: true });
const schema = z.union([timeSchema, draftSchema]);

type Schema = z.output<typeof schema>
const state = ref<Partial<Schema>>({
    id: undefined,
    start: undefined,
    end: undefined,
    notes: '',
});

function handleTimeDetailOpenUpdate(state: boolean) {
    if (!state) {
        close();
    }
}

function handleSave(event: FormSubmitEvent<Schema>) {
    const time = event.data

    if (isDraftValue(time)) {
        store.updateDraft(time);
    }
    if (isTimeValue(time)) {
        if (time.id === 'new') {
            store.times.addEntity({ ...time, id: nanoid() });
        } else {
            store.times.update(time.id, time);
        }
    }

    close();
}

function handleRemove() {
    if (isDraft.value) {
        store.resetDraft();
    }

    if (isTimeValue(currentTime?.value)) {
        store.times.remove(currentTime.value.id);
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
    <UDrawer
        :open="isOpen" :ui="{ container: 'max-w-xl mx-auto' }" title="Time Detail" description="Edit time details"
        @update:open="handleTimeDetailOpenUpdate">
        <template #header>
            <div class="text-center">
                <span class="font-mono text-2xl tabular-nums lining-nums tracking-wide">
                    {{ runningDuration }}
                </span>
            </div>
        </template>
        <template #body>
            <UForm :scheme="schema" :state="state" class="space-y-4" @submit="handleSave">
                <UFormField label="Start time" name="start">
                    <UInput v-model="state.start" type="text" class="w-full" />
                </UFormField>

                <UFormField v-if="isTimeValue(state) && state.end" label="End time" name="end">
                    <UInput v-model="state.end" type="text" class="w-full" />
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
