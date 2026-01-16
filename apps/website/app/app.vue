<script setup lang="ts">
import { en, de } from '@nuxt/ui/locale'

const locales = {
	en,
	de,
}

const { locale } = useI18n()

const uiLocale = computed(() => {
	return locales[locale.value] || de;
});

const lang = computed(() => uiLocale.value.code)
const dir = computed(() => uiLocale.value.dir)

useHead({
	htmlAttrs: {
		lang,
		dir
	},
})
useSeoMeta({
	robots: {
		index: true,
		follow: true,
	},
})

defineOgImageComponent('MetaOgImage', {
	siteName: 'www.zeity.dev',
	image: '/favicon.svg',
	imageRound: false,
});
</script>

<template>
	<UApp :locale="uiLocale">
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</UApp>
</template>