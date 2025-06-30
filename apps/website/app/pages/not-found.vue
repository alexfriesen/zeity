<template>
	<Content class="flex flex-col items-center">
		<UIcon name="i-lucide-triangle-alert" class="block h-32 w-32" />
		<h2 class="text-5xl">
			NOT FOUND
		</h2>
	</Content>
</template>

<script setup lang="ts">
definePageMeta({
	title: '404.title',
	description: '404.description',
})
useSeoMeta({
	robots: 'noindex',
})
</script>