<template>
	<AppContent>

		<Head v-if="page">
			<Title>{{ page.title }}</Title>
			<Meta name="description" :content="page.description" />
		</Head>

		<UBreadcrumb :items="breadcrumbs" class="mb-4" />

		<ContentRenderer v-if="page?.body" :value="page" tag="article" class="prose dark:prose-invert max-w-none" />
	</AppContent>
</template>

<script setup lang="ts">
import { kebabCase } from 'scule'
const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath();

const path = computed(() => route.path.replace(/\/$/, ''))
const collection = computed(() => `docs_${locale.value}`);
const breadcrumbs = getBreadcrumbs(route.params.slug);

const { data: page } = await useAsyncData(kebabCase(path.value), () => queryCollection(collection.value).path(path.value).first(), {
	watch: [path]
})

watch(page, (page) => {
	if (!page) {
		throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
	}
}, { immediate: true })

function getBreadcrumbs(slugs: string | string[] = []) {
	const segments = Array.isArray(slugs) ? slugs : [slugs];
	let url = '';

	const docsBreadcrumbs = segments.map((segment) => {
		url += segment + '/';
		return {
			label: segment,
			to: localePath(`/docs/${url}`),
		}
	});
	return [
		{
			label: t('docs.title'),
			to: localePath(`/docs`),
		},
		...docsBreadcrumbs,
	];
}
</script>