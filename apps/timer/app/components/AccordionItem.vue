<script setup lang="ts">
const open = defineModel<boolean>({ default: true });
defineProps({
	class: String,
	label: String,
	description: String,
});

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
		<slot />
	</div>
</template>