<template>
	<AppContent>

		<Head v-if="page">
			<Title>{{ page.title }}</Title>
			<Meta name="description" :content="page.description" />
		</Head>

		<ContentRenderer v-if="page?.body" :value="page" tag="article" class="prose dark:prose-invert max-w-none" />
	</AppContent>
</template>

<script setup lang="ts">
import { kebabCase } from 'scule'
const route = useRoute()
const { locale } = useI18n()
const path = computed(() => route.path.replace(/\/$/, ''))
const collection = computed(() => `docs_${locale.value}`);

const { data: page } = await useAsyncData(kebabCase(path.value), () => queryCollection(collection.value).path(path.value).first(), {
	watch: [path]
})


watch(page, (page) => {
	if (!page) {
		throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
	}
}, { immediate: true })
</script>