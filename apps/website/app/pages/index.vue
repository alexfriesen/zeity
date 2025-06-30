<template>
	<AppContent>
		<UCard>
			<template #header>
				{{ $t('home.title') }}
			</template>
			<div>
				<p>{{ $t('home.description') }}</p>
			</div>
			<div class="flex justify-center gap-2">
				<UButton :to="localePath('/docs')" variant="solid">
					{{ $t('home.openDocs') }}
				</UButton>
			</div>
		</UCard>
	</AppContent>
</template>

<script setup lang="ts">
const localePath = useLocalePath();

definePageMeta({
	title: 'home.title',
	description: 'home.description',
})
</script>
