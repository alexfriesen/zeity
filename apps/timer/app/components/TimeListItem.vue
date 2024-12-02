<script setup lang="ts">
import type { Time } from '~/types/time';
import { formatDuration, timeDiff } from '@zeity/utils/date';

const props = defineProps({
	class: {
		type: String,
		default: '',
	},
	label: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		default: '',
	},
	times: {
		type: Array as PropType<Time[]>,
		default: () => [],
	},
	defaultOpen: {
		type: Boolean,
		default: false,
	},
});
const timeDetail = useTimeDetail();

const open = defineModel<boolean>({ default: true });

if (props.defaultOpen !== undefined) {
	open.value = props.defaultOpen;
}

function handleToggle() {
	open.value = !open.value;
}
</script>

<template>
	<UButton type="button" class="flex items-center justify-between w-full" variant="ghost" size="xl"
		:aria-expanded="open" @click="handleToggle">
		<span class="text-left break-all line-clamp-1">{{ label }}</span>
		<template #trailing>
			<span class="inline-flex gap-2 items-center">
				<span class="tabular-nums text-sm">{{ description }}</span>
				<UIcon name="i-lucide-chevron-down" class="transform transition-transform duration-200"
					:class="{ 'rotate-0': open, '-rotate-180': !open }" />
			</span>
		</template>
	</UButton>

	<div v-if="open" :class="$props.class">
		<UButton v-for="time in times" :key="time.id" type="button" variant="ghost"
			class="w-full flex items-center justify-between gap-2" @click="timeDetail.open(time)">

			<div class="text-xs truncate text-[var(--ui-text-dimmed)]">
				<span>
					{{ time.notes || $t('times.addNotes') }}
				</span>
			</div>

			<div class="font-sans text-md text-[var(--ui-text-toned)]">
				<span class="tabular-nums">
					{{ formatDuration(timeDiff(time.end, time.start)) }}
				</span>
			</div>
		</UButton>
	</div>
</template>