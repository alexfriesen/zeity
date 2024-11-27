<script lang="ts">
import { DateFieldInput, DateFieldRoot } from 'reka-ui';
import { type ZonedDateTime, parseAbsolute, now, getLocalTimeZone } from '@internationalized/date';

export interface DateTimeProps {
    id?: string
    name?: string
    required?: boolean
    disabled?: boolean
    class?: unknown
}

export interface InputEmits {
    (e: 'update:modelValue', payload: string | number): void
    (e: 'blur', event: FocusEvent): void
    (e: 'change', event: Event): void
}
</script>

<script setup lang="ts">

const props = defineProps<DateTimeProps>();
const model = defineModel<string>({ default: '' });

const settings = useSettingsStore();
const datetimeValue = ref<ZonedDateTime>();

const { id, name, disabled } = useFormField<DateTimeProps>(props)

watch(model, (value) => {
    const tz = getLocalTimeZone();
    datetimeValue.value = value ? parseAbsolute(value, tz) : now(tz);
}, { immediate: true });
watch(datetimeValue, (value) => {
    if (!value) {
        return;
    }
    model.value = value.toAbsoluteString();
});

const ui = {
    base: 'flex items-center gap-0.5 rounded-[calc(var(--ui-radius)*1.5)] bg-[var(--ui-bg)] transition-colors tabular-nums text-sm text-center text-[var(--ui-text-highlighted)] border-0 px-2.5 py-1.5 ring ring-inset ring-[var(--ui-border-accented)] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ui-primary)] disabled:cursor-not-allowed disabled:opacity-75',
    segment: 'min-w-8 rounded p-0.5 border border-transparent focus:outline-none focus:border-[var(--ui-primary)] data-[placeholder]:text-[var(--ui-text-muted)]',
}
</script>

<template>
    <DateFieldRoot :id="id" v-bind="$attrs" v-slot="{ segments }" v-model="datetimeValue" :class="ui.base" :name="name"
        :required="required" :disabled="disabled" :locale="settings.language" granularity="second" hide-time-zone>
        <template v-for="item in segments" :key="item.part">
            <DateFieldInput v-if="item.part === 'literal'" :part="item.part">
                {{ item.value }}
            </DateFieldInput>
            <DateFieldInput v-else :part="item.part" :class="ui.segment">
                {{ item.value }}
            </DateFieldInput>
        </template>
    </DateFieldRoot>

</template>