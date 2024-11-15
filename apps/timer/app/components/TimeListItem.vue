<script setup lang="ts">
import type { Time } from '~/types/time';
import { formatDuration, timeDiff } from '@zeity/utils/date';

defineProps({
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
});
const timeDetail = useTimeDetail();

const open = defineModel<boolean>({ default: true });

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
				<span class="text-sm">{{ description }}</span>
				<UIcon name="i-lucide-chevron-down" class="transform transition-transform duration-200"
					:class="{ 'rotate-0': open, '-rotate-180': !open }" />
			</span>
		</template>
	</UButton>

	<div v-if="open" :class="$props.class">
		<UButton v-for="time in times" :key="time.id" type="button" variant="ghost"
			class="w-full flex items-center justify-between gap-2" @click="() =>
				timeDetail.open(time)">

			<div>
				<span class="text-xs text-neutral-400 dark:text-neutral-500">
					{{ time.notes || 'Add Notes' }}
				</span>
			</div>

			<div class="duration">
				<span class="font-sans text-md text-neutral-700 dark:text-neutral-200">
					{{ formatDuration(timeDiff(time.end, time.start)) }}
				</span>
			</div>
		</UButton>
	</div>
</template>