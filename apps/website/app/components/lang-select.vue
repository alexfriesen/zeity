<template>
	<UDropdownMenu :items="availableLanguages" size="xl">
		<UButton :icon="selected.icon" :label="selected.label" color="neutral" variant="outline"
			trailing-icon="i-lucide-chevron-down" size="xl" />
	</UDropdownMenu>
</template>

<script setup lang="ts">
const locale = useI18n().locale;
const switchLocalePath = useSwitchLocalePath();

const selected = computed(() => {
	const currentLocale = locale.value;
	const lang = availableLanguages.value.find(lang => lang.value === currentLocale);
	return lang || availableLanguages.value[0]!;
});

const availableLanguages = computed(() => [{
	value: 'en',
	label: 'English',
	icon: 'circle-flags:en',
	to: switchLocalePath('en'),
}, {
	value: 'de',
	label: 'Deutsch',
	icon: 'circle-flags:de',
	to: switchLocalePath('de'),
}]);

</script>
