<script lang="ts">
import { DateFieldInput, DateFieldRoot } from 'reka-ui';
import { type ZonedDateTime, parseAbsolute, now, getLocalTimeZone } from '@internationalized/date';


export interface DateTimeProps {
    // eslint-disable-next-line vue/require-default-prop
    id?: string
    // eslint-disable-next-line vue/require-default-prop
    name?: string
    // eslint-disable-next-line vue/require-default-prop
    class?: unknown
    required?: boolean
    disabled?: boolean
    granularity?: 'second' | 'minute' | 'hour' | 'day'
}
</script>

<script setup lang="ts">

const model = defineModel<string>();
const props = withDefaults(
    defineProps<DateTimeProps>(),
    {
        granularity: 'second',
    }
);

const settings = useSettingsStore();
const datetimeValue = ref<ZonedDateTime>();

const { id, name, disabled } = useFormField<DateTimeProps>(props)

watch(model, (value) => {
    const tz = getLocalTimeZone();
    datetimeValue.value = value ? parseAbsolute(value, tz) : now(tz);
}, { immediate: true });
watch(datetimeValue, (value) => {
    model.value = value ? value.toAbsoluteString() : '';
});

const ui = {
    base: 'flex items-center gap-0.5 rounded-[calc(var(--ui-radius)*1.5)] bg-[var(--ui-bg)] transition-colors tabular-nums text-sm text-center text-[var(--ui-text-highlighted)] border-0 px-3 py-1.25 ring ring-inset ring-[var(--ui-border-accented)] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ui-primary)] disabled:cursor-not-allowed disabled:opacity-75',
    segment: 'min-w-8 rounded p-0.5 border border-transparent focus:outline-none focus:border-[var(--ui-primary)] data-[placeholder]:text-[var(--ui-text-muted)]',
}
</script>

<template>
    <DateFieldRoot :id="id" v-bind="$attrs" v-slot="{ segments }" v-model="datetimeValue" :class="ui.base" :name="name"
        :required="required" :disabled="disabled" :locale="settings.locale" :granularity="granularity" hide-time-zone>
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