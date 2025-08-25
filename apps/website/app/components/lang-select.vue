<template>
	<UDropdownMenu :items="availableLanguages" size="xl">
		<UButton :icon="selected.icon" :label="selected.label" color="neutral" variant="outline"
			trailing-icon="i-lucide-chevron-down" size="xl" />
	</UDropdownMenu>
</template>

<script setup lang="ts">
const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const selected = computed(() => {
	const currentLocale = locale.value;
	const lang = availableLanguages.value.find(lang => lang.value === currentLocale);
	return lang || availableLanguages.value[0]!;
});

const availableLanguages = computed(() => (locales.value).map(locale => ({
	value: locale.code,
	label: locale.name,
	icon: `circle-flags:${locale.code}`,
	to: switchLocalePath(locale.code),
})));

</script>
