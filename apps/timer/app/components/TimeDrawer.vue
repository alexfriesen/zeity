<script setup lang="ts">
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

const isDraft = computed(() => currentTime?.value && !('end' in currentTime.value));

const now = ref(new Date());
let interval: ReturnType<typeof setInterval> | undefined;

function startInterval() {
    console.log('startInterval');
    now.value = new Date();
    interval = setInterval(() => {
        now.value = new Date();
    }, 1000);
}
onUnmounted(() => {
    clearInterval(interval);
});
watch([isDraft, isOpen], ([isDraft, isOpen]) => {
    if (isOpen && currentTime.value) {
        const clone = structuredClone(toRaw(currentTime.value));

        state.value = clone;
    }

    if (isDraft && isOpen) {
        startInterval();
    } else {
        clearInterval(interval);
    }
});

const runningDuration = computed(() => {
    const time = currentTime?.value;
    if (!time) return '00:00:00';

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

    if (!time) return;

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

    if (currentTime.value && 'id' in currentTime.value) {
        store.times.remove(currentTime.value.id);
    }

    close();
}

function isDraftValue(value: Time | DraftTime | Schema): value is DraftTime {
    return !('end' in value);
}
function isTimeValue(value: Time | DraftTime | Schema): value is Time {
    return 'end' in value;
}
</script>

<template>
    <UDrawer :open="isOpen" :ui="{ container: 'max-w-xl mx-auto' }" title="Time Detail" description="Edit time details"
        @update:open="handleTimeDetailOpenUpdate">
        <template #body>
            <div class="m-4">
                <div class="text-center">
                    {{ runningDuration }}
                </div>
            </div>
            <UForm :scheme="schema" :state="state" class="space-y-4" @submit="handleSave">
                <UFormField label="start" name="start">
                    <UInput v-model="state.start" type="text" class="w-full" />
                </UFormField>

                <UFormField v-if="isTimeValue(state) && state.end" label="end" name="end">
                    <UInput v-model="state.end" type="text" class="w-full" />
                </UFormField>

                <UFormField label="notes" name="notes">
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
