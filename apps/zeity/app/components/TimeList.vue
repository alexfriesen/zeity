<script setup lang="ts">
import { calculateDiffSum, dayDiff, formatDate, formatDuration, formatRelativeDate, toStartOfDay, type DateLike, } from '@zeity/utils/date';
import type { Time } from '@zeity/types/time';

const props = defineProps({
	class: { type: String, default: '' },
	times: { type: Array as PropType<Time[]>, required: true },
	defaultOpen: { type: Boolean, default: false },
});
const times = toRef(props, 'times');

const { locale } = storeToRefs(useSettingsStore());

const groups = computed(() => {
	const all = times.value || [];

	const groups: Record<string, { label: string, data: Time[] }> = {};
	for (let i = 0; i < all.length; i++) {
		const item = all[i];
		if (!item) continue;

		const key = getGroupKey(item.start);
		if (!groups[key]) {
			groups[key] = { label: key, data: [] };
		}
		groups[key].data.push(item);
	}

	return groups;
});

function getGroupKey(date: DateLike): string {
	const now = new Date()
	const diff = dayDiff(date, now);

	if (diff < 1) {
		return formatRelativeDate(now, toStartOfDay(date), locale.value);
	}

	return formatDate(toStartOfDay(date), locale.value);
}
</script>

<template>
	<div class="flex flex-col gap-3" :class="$props.class">
		<div v-for="group in groups" :key="group.label"
			class="w-full flex flex-col overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-md">
			<TimeListItem :default-open="defaultOpen" :label="group.label"
				:description="formatDuration(calculateDiffSum(group.data))" :times="group.data" class="m-1" />
		</div>
	</div>
</template>