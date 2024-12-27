<script setup lang="ts">
import NumberFlow, { NumberFlowGroup } from '@number-flow/vue'

const model = defineModel<number>({ default: 0 });

const seconds = computed(() => Math.trunc(model.value / 1000));

const hh = computed(() => Math.floor(seconds.value / 3600))
const mm = computed(() => Math.floor((seconds.value % 3600) / 60))
const ss = computed(() => seconds.value % 60)

const trend = +1;
const format = { minimumIntegerDigits: 2 };
const digits = { 1: { max: 5 } };
</script>

<template>
    <NumberFlowGroup>
        <div style="--number-flow-char-height: 0.85em" :class="$attrs.class"
            class="flex items-baseline tabular-nums overflow-hidden">
            <NumberFlow :trend="trend" :format="format" :value="hh" />
            <NumberFlow :trend="trend" :format="format" :value="mm" :digits="digits" prefix=":" />
            <NumberFlow :trend="trend" :format="format" :value="ss" :digits="digits" prefix=":" />
        </div>
    </NumberFlowGroup>
</template>
