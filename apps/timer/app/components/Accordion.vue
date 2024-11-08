<script setup lang="ts">
</script>

<template>
	<div class="w-full flex flex-col overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-md"
		:class="$props.class">
		<slot />
	</div>
</template>