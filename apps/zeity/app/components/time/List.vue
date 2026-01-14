<script setup lang="ts">
import { addMilliseconds } from 'date-fns'
import type { Time } from '@zeity/types/time';
import type { DateLike } from '@zeity/utils/date';
import { calculateDiffSum, dayDiff, formatDate, formatDuration, formatRelativeDate, toStartOfDay, timeDiff, parseDate } from '@zeity/utils/date';

const { times, calculateBreaks } = defineProps({
	class: { type: String, default: '' },
	times: { type: Array as PropType<Time[]>, required: true },
	defaultOpen: { type: Boolean, default: false },
	calculateBreaks: { type: Boolean, default: false },
});
const { locale } = storeToRefs(useSettingsStore());

const groups = computed(() => {
	const all = times || [];

	const groups: Record<string, { label: string, data: Time[] }> = {};
	for (let i = 0; i < all.length; i++) {
		const item = all[i];
		if (!item) continue;

		const key = getGroupKey(item.start);
		if (!groups[key]) {
			groups[key] = { label: key, data: [] };
		}
		groups[key].data.push(item);

		if (calculateBreaks) {
			const nextItem = all[i + 1];
			if (!nextItem) continue;
			// only add break if next item is in the same group
			if (key !== getGroupKey(nextItem.start)) continue;

			const nextEnd = addMilliseconds(parseDate(nextItem.start), nextItem.duration);
			const duration = timeDiff(item.start, nextEnd);
			if (duration < 1) continue;

			groups[key].data.push({
				id: `break-${item.id}`,
				type: 'break',
				start: nextEnd.toISOString(),
				duration: duration,
			} as Time);
		}
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