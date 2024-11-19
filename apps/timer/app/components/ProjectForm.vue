<script setup lang="ts">
import { z } from 'zod';
import { nanoid } from 'nanoid';
import type { FormSubmitEvent } from '@nuxt/ui';

import { PROJECT_STATUS_ACTIVE, PROJECT_STATUSES } from '~/types/project';

const props = defineProps({
    data: {
        type: Object as PropType<Schema>,
        required: true
    },
});
const emits = defineEmits(['submit']);

const schema = z.object({
    id: z.string().default(nanoid()),
    status: z.enum(PROJECT_STATUSES).default(PROJECT_STATUS_ACTIVE),
    name: z.string().min(3).default(''),
    notes: z.string().default(''),
});
type Schema = z.output<typeof schema>
const state = ref<Partial<Schema>>({
    id: undefined,
    status: undefined,
    name: '',
    notes: '',
});

watch(props.data, (data) => {
    if (data) {
        state.value = Object.assign({}, data);
    }
}, { immediate: true });

function handleSubmit(event: FormSubmitEvent<Schema>) {
    emits('submit', event.data);
}
</script>

<template>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="handleSubmit">
        <UFormField label="Name" name="name">
            <UInput v-model="state.name" class="w-full" />
        </UFormField>
        <UFormField label="Status" name="status">
            <USelect v-model="state.status" :items="projectStatusFormItems" class="w-full">
                <template #leading="{ modelValue, ui }">
                    <UChip v-if="modelValue" inset standalone :color="getProjectStatusColor(state.status!)"
                        :size="ui.itemLeadingChipSize()" :class="ui.itemLeadingChip()" />
                </template>
            </USelect>
        </UFormField>
        <UFormField label="Notes" name="notes">
            <UTextarea v-model="state.notes" class="w-full" autoresize />
        </UFormField>

        <UButton block type="submit">Save</UButton>
    </UForm>
</template>